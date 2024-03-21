const vscode = require('vscode');
const path = require('path');
const { exec } = require('child_process');

let javaFileWatcher;
let htmlFileWatcher;
let cssFileWatcher;
let jsFileWatcher;
let jspFileWatcher;
let timeout;
let mavenProcess;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = vscode.commands.registerCommand('tomcatmavenhelper.livemaveninstall', function () {
        const workspaceFolder = vscode.workspace.workspaceFolders[0]; 
        const pomPath = path.join(workspaceFolder.uri.fsPath, 'pom.xml');

        monitorJavaFiles(workspaceFolder, pomPath);

        const message = vscode.window.showInformationMessage('Live Maven Install activated!');
        
        setTimeout(() => {
            message.dispose();
        }, 1000);

    });

    context.subscriptions.push(disposable);
}

function deactivate() {
    if (javaFileWatcher) {
        javaFileWatcher.dispose();
    }

    if (timeout) {
        clearTimeout(timeout);
    }

    if (mavenProcess) {
        mavenProcess.kill();
    }

}

function monitorJavaFiles(workspaceFolder, pomPath) {
    javaFileWatcher = vscode.workspace.createFileSystemWatcher('**/*.java');
    htmlFileWatcher = vscode.workspace.createFileSystemWatcher('**/*.html');
    cssFileWatcher = vscode.workspace.createFileSystemWatcher('**/*.css');
    jsFileWatcher = vscode.workspace.createFileSystemWatcher('**/*.js');
    jspFileWatcher = vscode.workspace.createFileSystemWatcher('**/*.jsp');

    javaFileWatcher.onDidChange(() => {
        setTimeout(() => {
            if (mavenProcess) {
                mavenProcess.kill();
                console.log('Compilation process cancelled due to code changes.');
            }
            executeMavenInstall(pomPath);
        }, 500);
    });

    htmlFileWatcher.onDidChange(() => {
        setTimeout(() => {
            if (mavenProcess) {
                mavenProcess.kill();
                console.log('Compilation process cancelled due to code changes.');
            }
            executeMavenInstall(pomPath);
        }, 500);
    });

    cssFileWatcher.onDidChange(() => {
        setTimeout(() => {
            if (mavenProcess) {
                mavenProcess.kill();
                console.log('Compilation process cancelled due to code changes.');
            }
            executeMavenInstall(pomPath);
        }, 500);
    });

    jsFileWatcher.onDidChange(() => {
        setTimeout(() => {
            if (mavenProcess) {
                mavenProcess.kill();
                console.log('Compilation process cancelled due to code changes.');
            }
            executeMavenInstall(pomPath);
        }, 500);
    });

    jspFileWatcher.onDidChange(() => {
        setTimeout(() => {
            if (mavenProcess) {
                mavenProcess.kill();
                console.log('Compilation process cancelled due to code changes.');
            }
            executeMavenInstall(pomPath);
        }, 500);
    });
    
}

function executeMavenInstall(pomPath) {

    mavenProcess = exec(`mvn package -f '${pomPath}'`, (error) => {
        if (error) {
            vscode.window.showWarningMessage(`Compiling restarted or error executing 'mvn install': ${error.message}`);
        }
    });

    mavenProcess.on('exit', (code) => {
        if (code === 0) {
            setTimeout(() => {
                vscode.window.showInformationMessage(`'mvn package' completed successfully!`);
            }, 1000);
        }
    });
}

module.exports = {
    activate,
    deactivate
};
