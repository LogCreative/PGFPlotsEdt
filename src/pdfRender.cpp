
#include "pdfRender.h"

pdfRender::pdfRender(QString path):pdfName(path){}

QImage pdfRender::pdfTest(){
    document = Poppler::Document::load(pdfName);
    if(!document||document->isLocked()){
        delete document;
    } else {
        pdfPage = document->page(0);
        QImage image = pdfPage->renderToImage();
        return image;
    }
}

pdfRender::~pdfRender(){
    delete pdfPage;
    delete document;
}
