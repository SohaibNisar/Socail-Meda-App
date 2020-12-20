import React from 'react'

// mui
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

export default ({ content, tip, onClick, color, className, size }) => {
    return (
        <Tooltip title={tip} arrow>
            <IconButton size={size} onClick={onClick} color={color} className={className}>
                {content}
            </IconButton>
        </Tooltip>
    )
}

