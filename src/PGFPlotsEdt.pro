QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

CONFIG += c++11

#win32: INCLUDEPATH += $$PWD/poppler/win32/Include
win32: LIBS += -L$$PWD/poppler/win32 -llibpoppler
win32: LIBS += -L$$PWD/poppler/win32 -llibpoppler-qt5

#win64: failed to link
win64: LIBS += -L$$PWD/poppler/win64 -poppler
win64: LIBS += -L$$PWD/poppler/win64 -poppler-cpp

unix: PKGCONFIG += poppler-qt5
unix: CONFIG += c++11 link_pkgconfig

# The following define makes your compiler emit warnings if you use
# any Qt feature that has been marked deprecated (the exact warnings
# depend on your compiler). Please consult the documentation of the
# deprecated API in order to know how to port your code away from it.
DEFINES += QT_DEPRECATED_WARNINGS

# You can also make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
# You can also select to disable deprecated APIs only up to a certain version of Qt.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    main.cpp \
    mainwindow.cpp \
    pdfRender.cpp

HEADERS += \
    mainwindow.h \
    pdfRender.h

FORMS +=

TRANSLATIONS += \
    PGFPlotsEdt_zh_CN.ts

QT += widgets

RESOURCES += application.qrc

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

DISTFILES += \
    PGFPlotsEdt_zh_CN.qm \
    testcases/sync.pdf
