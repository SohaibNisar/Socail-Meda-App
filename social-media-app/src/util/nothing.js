import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// mui
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


class Nothing extends Component {
    render() {
        return (
            <Typography component='span' align='center' gutterBottom>
                <Card>
                    {this.props.mainText && <Typography style={{ fontWeight: 'bolder', marginTop: '20px' }}>
                        {this.props.mainText}
                    </Typography>}
                    {this.props.subText && <CardContent style={{ paddingBottom: '0' }}>
                        <Typography color="textSecondary" align='center'>
                            {this.props.subText}
                        </Typography>
                    </CardContent>}
                    <Link to='/friends'>
                        <Button size={this.props.size} variant="contained" color="primary" component="span" style={{ margin: '20px auto' }} >
                            Find Friends
                    </Button>
                    </Link>
                </Card>
            </Typography >
        )
    }
}

export default Nothing;