
function printResume() { 
    const pdfWindow = window.open('/resume/download', '_blank');
    pdfWindow.onload = function() {
        pdfWindow.focus();   
        pdfWindow.print();   
    };
}