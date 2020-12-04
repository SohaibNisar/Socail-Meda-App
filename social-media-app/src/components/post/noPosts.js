import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// mui
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


class noPosts extends Component {
    render() {
        return (
            <Typography component='span' align='center'>
                <Card style={{ marginBottom: '20px' }}>
                    <Typography style={{ fontWeight: 'bolder', marginTop: '20px' }}>
                        {this.props.mainText}
                    </Typography>
                    <CardContent>
                        <Typography color="textSecondary" component="p" align='center'>
                            {this.props.subText}
                        </Typography>
                    </CardContent>
                    <Link to='/friends'>
                        <Button variant="contained" color="primary" component="span" style={{ marginBottom: '20px' }} >
                            Find Friends
                        </Button>
                    </Link>
                </Card>
            </Typography>
        )
    }
}

export default noPosts;
