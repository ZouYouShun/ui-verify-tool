import React, { PureComponent } from 'react';

import { ScreenshotContextType } from './screenshot.context';

export default class ScreenshotViewerEditPoint extends PureComponent<{
  pointers: ScreenshotContextType['editPointers'];
}> {
  render() {
    return (
      <>
        {this.props.pointers &&
          this.props.pointers.map((pointer) => {
            return (
              <div
                key={pointer.name}
                className="screenshot-viewer-edit-pointer"
                style={{
                  transform: `translate(${pointer.x - pointer.size / 2}px, ${
                    pointer.y - pointer.size / 2
                  }px)`,
                  width: `${pointer.size}px`,
                  height: `${pointer.size}px`,
                  borderColor: pointer.color,
                }}
              />
            );
          })}
      </>
    );
  }
}
