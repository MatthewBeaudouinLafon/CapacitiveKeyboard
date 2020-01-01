import * as vscode from 'vscode';

// Message from keyboard input server
interface KIMessage {
	data: string;
}

let io = require('socket.io-client');
const socket = io('http://localhost:5000/test');

let myStatusBarItem: vscode.StatusBarItem;
export function activate({ subscriptions }: vscode.ExtensionContext) {

	// Update status bar when we receive an update
	socket.on('keyboard_input', (message: KIMessage) => {
		if (message.data) {
			myStatusBarItem.text = `$(megaphone) Key = ${message.data}`;
			myStatusBarItem.show();
		} else {
			myStatusBarItem.hide();
		}
	});
	// Register command
	// TODO: change the name from hello world (need to change elsewhere too)
	const myCommandId = 'extension.shortcuthint';
	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {}));

	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBarItem.command = myCommandId;
	subscriptions.push(myStatusBarItem);

	// TODO: Try harder to keep the connection to the server. Probably try to connect on disconnect.
}

// TODO: probably clean up on deactivate
export function deactivate() {}
