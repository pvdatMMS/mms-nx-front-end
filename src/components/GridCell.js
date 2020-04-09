import React from 'react';

const GridCell = ({ cellKey, style, cellData, image, renderMaker, onClickLayout, onMouseMove, onDoubleClickLayout }) => {
    return (
        <div key={cellKey}
            style={{
                ...style,
                backgroundImage: `url(${image})`,
                backgroundRepeat: 'no-repeat',
                float: 'left',
                backgroundSize: '100% 100%'
            }}
            onDoubleClick={onDoubleClickLayout ? onDoubleClickLayout : () => {}}
            onClick={onClickLayout ? onClickLayout : () => {}}
            onMouseMove={onMouseMove ? onMouseMove : () => {}}
        >
            {
                renderMaker()
            }
        </div>
    )
}
export default GridCell;