#ifndef MAINWINDOW_H
#define MAINWINDOW_H

/* 2020/9/24 Initial UI
 * Use code to generate UI
 * instead of .ui file.
*/

#include<QMainWindow>
#include <QTranslator>

QT_BEGIN_NAMESPACE
class QAction;
class QMenu;
class QPlainTextEdit;
class QSessionManager;
QT_END_NAMESPACE

//! [0]
class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow();

    void loadFile(const QString &fileName);

protected:
    void closeEvent(QCloseEvent *event) override;

private slots:
    void newFile();
    void open();
    bool save();
    bool saveAs();
    void tr_EN();
    void tr_CN();
    void about();
    void documentWasModified();
#ifndef QT_NO_SESSIONMANAGER
    void commitData(QSessionManager &);
#endif

private:
    void createActions();
    void createStatusBar();
    void readSettings();
    void writeSettings();
    bool maybeSave();
    bool saveFile(const QString &fileName);
    void setCurrentFile(const QString &fileName);
    QString strippedName(const QString &fullFileName);

    QPlainTextEdit *textEdit;
    QString curFile;

//    QAction *trENAct;
//    QAction *trCNAct;
};
//! [0]

#endif // MAINWINDOW_H
