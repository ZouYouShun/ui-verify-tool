import { ListenerOptions, TransportOptions } from '../interface';
import { Transport } from '../transport';

import type { BrowserWindow, IpcMain, IpcRenderer } from 'electron';

const defaultChannel = '$$Electron_Transport$$';

interface ElectronTransportOptions extends Partial<TransportOptions> {
  /**
   * Specify a Electron channel name.
   */
  channel?: string;
}

export interface ElectronMainTransportOptions extends ElectronTransportOptions {
  /**
   * Specify a browser windows created by the Electron main process.
   */
  browserWindow: BrowserWindow;
  /**
   * Communicate asynchronously from the main process to renderer processes.
   */
  ipcMain: IpcMain;
}

export interface ElectronRendererTransportOptions
  extends ElectronTransportOptions {
  /**
   * Communicate asynchronously from a renderer process to the main process.
   */
  ipcRenderer: IpcRenderer;
}

export abstract class ElectronMainTransport<T = any, P = any> extends Transport<
  T,
  P
> {
  constructor({
    ipcMain,
    browserWindow,
    channel = defaultChannel,
    listener = (callback) => {
      const handler = (_: Electron.IpcMainEvent, data: ListenerOptions) => {
        callback(data);
      };

      ipcMain.on(channel, handler);

      return () => {
        ipcMain.off(channel, handler);
      };
    },
    sender = (message) => browserWindow.webContents.send(channel, message),
    ...options
  }: ElectronMainTransportOptions) {
    super({
      ...options,
      listener,
      sender,
    });
  }
}

export abstract class ElectronRendererTransport<
  T = any,
  P = any,
> extends Transport<T, P> {
  constructor({
    ipcRenderer,
    channel = defaultChannel,
    listener = (callback) => {
      const handler = (_: Electron.IpcRendererEvent, data: ListenerOptions) => {
        callback(data);
      };
      ipcRenderer.on(channel, handler);

      return () => {
        ipcRenderer.off(channel, handler);
      };
    },
    sender = (message) => ipcRenderer.send(channel, message),
    ...options
  }: ElectronRendererTransportOptions) {
    super({
      ...options,
      listener,
      sender,
    });
  }
}

export const ElectronTransport = {
  Main: ElectronMainTransport,
  Renderer: ElectronRendererTransport,
};
