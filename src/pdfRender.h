#ifndef PDFRENDER_H
#define PDFRENDER_H

#include "../poppler/qt5/src/poppler-qt5.h"
#include <QImage>

class pdfRender{
public:
    pdfRender(QString);
    QImage pdfTest();
    ~pdfRender();
private:
    QString pdfName;
    Poppler::Document* document;
    Poppler::Page* pdfPage;
};

#endif // PDFRENDER_H
