import React from 'react'

// mui
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

export default ({ content, tip, onClick, color }) => {
    return (
        <Tooltip title={tip} arrow>
            <IconButton size='medium' onClick={onClick} color={color}>
                {content}
            </IconButton>
        </Tooltip>
    )
}

