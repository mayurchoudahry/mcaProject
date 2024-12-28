import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import pdfToText from 'react-pdftotext';

function NoteSummarizer() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfText, setPdfText] = useState('');

  // Handle PDF upload
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    extractTextFromPDF(uploadedFile);
  };

  // Extract text from PDF using react-pdftotext
  const extractTextFromPDF = (file) => {
    pdfToText(file)
      .then(text => {
        console.log(text); // Show extracted text in console
        setPdfText(text); // Set extracted text in state (for summarization later)
      })
      .catch(error => {
        console.error("Failed to extract text from pdf", error);
      });
  };

  // Summarize extracted text using Hugging Face API
  const handleSummarize = async () => {
    if (!file) {
      alert('Please upload a PDF file first.');
      return;
    }
    setLoading(true);

    // Call Hugging Face API with the extracted PDF text
    const summaryResult = await query({ inputs: pdfText });
    
    // Process and structure the summary into topics and subtopics
    const structuredSummary = formatSummary(summaryResult[0]?.summary_text || 'No summary available.');
    setSummary(structuredSummary);
    
    setLoading(false);
  };

  // Query function for Hugging Face API
  async function query(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }

  // Function to format the summary into structured topics and subtopics
  const formatSummary = (text) => {
    // Split the text into lines and filter out empty lines
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const formatted = [];

    lines.forEach((line) => {
      line = line.trim(); // Clean up the line

      // Example logic to determine if a line is a topic or subtopic
      if (/^\d+\.|^[A-Z].*$/g.test(line)) {
        // Lines that start with a number or capital letter are considered topics
        formatted.push({ topic: line, subtopic: '' });
      } else {
        // Otherwise, it's a subtopic
        const lastItem = formatted[formatted.length - 1];
        if (lastItem) {
          lastItem.subtopic += line + ' '; // Append to the last topic's subtopic
        }
      }
    });

    return formatted;
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-purple-800 via-black to-blue-900 text-white flex flex-col">
      <NavBar />
      <main className="flex flex-col items-center justify-center flex-grow p-10">
        <h3 className="text-4xl font-bold mb-6">Note Summarizer</h3>

        {/* PDF Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl w-full bg-gray-900 p-6 rounded-lg shadow-lg"
        >
          <label className="block mb-2 text-xl">Upload PDF:</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="mb-4"
          />

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSummarize}
            className="mt-4 p-2 bg-purple-600 rounded hover:bg-purple-500 transition-colors"
            disabled={loading}
          >
            {loading ? 'Summarizing...' : 'Summarize'}
          </motion.button>
        </motion.div>

        {/* Display Structured Summary */}
        {summary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-left bg-gray-700 p-4 rounded shadow-lg w-2/3 mt-8"
          >
            <h3 className="text-3xl font-bold mb-4">Summary</h3>
            <div>
              {summary.map((item, index) => (
                <div key={index} className="mb-4">
                  {item.topic && <p className="font-bold text-xl">{item.topic}</p>}
                  {item.subtopic && <p className="text-lg">{item.subtopic}</p>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default NoteSummarizer;
