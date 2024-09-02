export async function post({ request }) {
    // Parse the form data
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
  
    // Validate the form data (optional, but recommended)
    if (!name || !email || !message) {
      return new Response('All fields are required', { status: 400 });
    }
  
    // You can store the data in a file, database, or send it via email
    // Here, we'll demonstrate saving it to a simple JSON file for simplicity
    try {
      const fs = await import('fs').then((mod) => mod.promises);
      const path = await import('path');
  
      const data = { name, email, message, date: new Date().toISOString() };
      const filePath = path.join(process.cwd(), 'contact_submissions.json');
  
      // Read existing data, append the new submission, and write back to the file
      let existingData = [];
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        existingData = JSON.parse(fileContent);
      } catch (err) {
        if (err.code !== 'ENOENT') throw err; // Ignore file not found errors
      }
  
      existingData.push(data);
      await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
  
      // Return a success response
      return new Response('Form submitted successfully', { status: 200 });
    } catch (err) {
      console.error('Error writing to file', err);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
  