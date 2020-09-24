/* 2020/9/24 Modification from the example of Application example.
 *
 *
 */

//! [0]
#include <QApplication>
#include <QCommandLineParser>
#include <QCommandLineOption>
#include <QTranslator>

#include "mainwindow.h"

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);

    /* 2020/9/24 Translation Made by Liguist
     *
     */
    QTranslator trans;
    trans.load(":/PGFPlotsEdt_zh_CN.qm");
    app.installTranslator(&trans);

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
