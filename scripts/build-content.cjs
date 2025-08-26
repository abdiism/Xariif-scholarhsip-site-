const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });// loading firebase skey
const matter = require('gray-matter');
const { marked } = require('marked');

// =================================================================
// START: NEW FIREBASE CODE
// =================================================================

// 1. Import the Firebase Admin SDK
const admin = require('firebase-admin');

// 2. Initialize Firebase
// IMPORTANT: This requires you to set up a `FIREBASE_SERVICE_ACCOUNT_KEY`
// environment variable in your Netlify build settings.
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  console.log('Please ensure FIREBASE_SERVICE_ACCOUNT_KEY is set correctly in your build environment.');
  // Exit the script if Firebase can't be initialized, to prevent build errors.
  process.exit(1); 
}

// 3. Get a reference to the Firestore database
const db = admin.firestore();

// =================================================================
// END: NEW FIREBASE CODE
// =================================================================


// --- Your original code (unchanged) ---
const contentDir = path.join(__dirname, '../content');
const outputDir = path.join(__dirname, '../src/data');
const outputFile = path.join(outputDir, 'content.json');

function getAllContent() {
  const allContent = {};
  const contentTypes = fs.readdirSync(contentDir);

  contentTypes.forEach(type => {
    const typeDir = path.join(contentDir, type);
    if (fs.lstatSync(typeDir).isDirectory()) {
      const files = fs.readdirSync(typeDir).filter(file => file.endsWith('.md'));
      
      allContent[type] = files.map(file => {
        const filePath = path.join(typeDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        
        const id = path.basename(file, '.md');
        const htmlContent = marked(content);

        // === FIX APPLIED HERE: Added the 'isPublished' field ===
        return {
          id,
          ...data,
          content: htmlContent,
          // If isPublished is explicitly set to false in Markdown, respect it. Otherwise, default to true.
          isPublished: data.isPublished === false ? false : true,
          upvotes: data.upvotes || 0,
          views: data.views || 0,
        };
      });
    }
  });

  return allContent;
}

function buildContent() {
  const content = getAllContent();
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(content, null, 2));
  console.log('✅ Local content.json built successfully!');
}
// --- End of your original code ---


// =================================================================
// START: NEW SYNC FUNCTION
// =================================================================

async function syncToFirestore() {
  const allContent = getAllContent();
  console.log('Starting Firestore sync...');

  // An array to hold all our database write promises
  const allPromises = [];

  // Loop over each content type (e.g., 'blogs', 'scholarships')
  for (const contentType in allContent) {
    const posts = allContent[contentType];
    console.log(`Found ${posts.length} documents in '${contentType}' to sync.`);

    // Loop over each post in the content type
    posts.forEach(post => {
      // Set the document ID in Firestore to be the post's ID (from the filename)
      const docRef = db.collection(contentType).doc(post.id);
      
      // Add the .set() operation to our list of promises
      // .set() will create the document if it doesn't exist, or overwrite it if it does.
      allPromises.push(docRef.set(post));
    });
  }

  // Wait for all the database writes to complete
  await Promise.all(allPromises);
  console.log('✅ Firestore sync completed successfully!');
}

// =================================================================
// END: NEW SYNC FUNCTION
// =================================================================


// --- New main function to run both tasks ---
async function main() {
  // First, run your original function to build the local JSON file
  buildContent();
  
  // Then, run the new function to sync the content to Firestore
  try {
    await syncToFirestore();
  } catch (error) {
    console.error('🔥 An error occurred during Firestore sync:', error);
    process.exit(1); // Exit with an error code
  }
}

// --- Run the main function ---
main();