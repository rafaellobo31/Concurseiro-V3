import * as pdfjs from 'pdfjs-dist';

// Configurar o worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

/**
 * Utilitários para extração de texto de arquivos PDF.
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  console.log(`Extracting text from PDF: ${file.name}`);
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Extrair texto de cada página
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Não foi possível extrair o texto do PDF. Verifique se o arquivo não está protegido por senha.');
  }
}
