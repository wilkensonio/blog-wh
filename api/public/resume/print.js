
function printResume() {
    const pdfWindow = window.open('./resume.pdf', '_blank');
    pdfWindow.onload = function() {
        pdfWindow.focus();   
        pdfWindow.print();   
    };
}