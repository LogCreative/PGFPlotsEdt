/* 2020/9/24 Modification from the example of Application example.
 *
 *
 */

//! [0]
#include <QApplication>
#include <QCommandLineParser>
#include <QCommandLineOption>

#include "mainwindow.h"
#include "pdfRender.h"

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);

    /* 2020/9/24 Translation Made by Linguist
     * 2020/9/27 Select Translation Automatically
     */

    QTranslator trans;
    if(QLocale::system().name()=="zh_CN"){
        trans.load(":/PGFPlotsEdt_zh_CN.qm");
        app.installTranslator(&trans);
    }

    Q_INIT_RESOURCE(application);

    QCoreApplication::setOrganizationName("LogCreative");
    QCoreApplication::setApplicationName("PGFPlotsEdt");
    QCoreApplication::setApplicationVersion(QT_VERSION_STR);
    QCommandLineParser parser;
    parser.setApplicationDescription(QCoreApplication::applicationName());
    parser.addHelpOption();
    parser.addVersionOption();
    parser.addPositionalArgument("file", "The file to open.");
    parser.process(app);

    MainWindow mainWin;
    if (!parser.positionalArguments().isEmpty())
        mainWin.loadFile(parser.positionalArguments().first());
    mainWin.show();
    return app.exec();
}
//! [0]
