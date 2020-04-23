import React, { Component } from 'react';
import MetaTags from 'react-meta-tags';
import ApiService from "./service/ApiService";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import SearchIcon from '@material-ui/icons/Search';
import clearDay from './weather-icon/clear-day.svg';
import clearNight from './weather-icon/clear-night.svg';
import cloudy from './weather-icon/cloudy.svg';
import fog from './weather-icon/fog.svg';
import partlyCloudDay from './weather-icon/partly-cloudy-day.svg';
import partlyCloudNight from './weather-icon/clear-night.svg';
import rain from './weather-icon/rain.svg';
import sleet from './weather-icon/sleet.svg';
import snow from './weather-icon/snow.svg';
import wind from './weather-icon/wind.svg';

import styles from './App.css';

const progress = {
    color: '#00BCD4',
    textAlign: 'center',
    padding: '10rem 0',
    border: 0,
    paddingrght: 0,
    margin: 'auto'
  };

const cellProgress = {
    textAlign: 'center',
  };

const iconSize = {
    width: '40px',
  };

const gridMargin = {
    padding: '1rem',
  };


class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            address: "",
            data: [],
            zipOrAddress: "",
            weeksBehind: 1,
            isLoading: false,
            zipOrAddressError: "",
        }
        this.goFetchData = this.goFetchData.bind(this);
    }

    handleChange = name => (value) => {
        console.log("Name: " + name + ", value: " + value.target.value);
        switch (name) {
            case 'zipOrAddress':
                var errorMsg = this.state.zipOrAddressError;
                if (value.target.value === "") {
                    errorMsg = "";
                }
                this.setState({
                            zipOrAddress: value.target.value,
                            zipOrAddressError: errorMsg
                        });
                break;
            case 'weeksBehind':
                this.setState({weeksBehind: value.target.value});
                break;
            default:
                break;
        }
    }

    is_usZipCode(str) {
        var regexp = /^[0-9]{5}(?:-[0-9]{4})?$/;    
        if (regexp.test(str)){
            return true;
        } else {
            return false;
        }
    }

    goFetchData() {
        console.log("zipOrAddress: " + this.state.zipOrAddress + ", weeksBehind: " + this.state.weeksBehind);
        // if (this.state.zipOrAddress === null || this.state.weeksBehind === null) {
        //     this.setState({data: []})
        //     return;
        // }
        
        if (!this.is_usZipCode(this.state.zipOrAddress)) {
            this.setState({zipOrAddressError: this.state.zipOrAddress + " not a valid zip code"});
            return;
        }
        this.setState({data: [], isLoading: true, address: ""});
        ApiService.fetchWeatherReport(this.state.zipOrAddress, this.state.weeksBehind)
            .then((res) => {
                this.setState({
                    data: res.data.data.data,
                    address: res.data.data.address,
                    isLoading: false,
                    zipOrAddressError: ""
                    })
            }).catch((err) => {
                console.log("axios error: " + err.response);
                console.log(err.response.data);
                console.log(err.response.status);
                var errMsg = "";
                if (err.response.data.data.code === "1") {
                    errMsg = err.response.data.data.message
                }
                console.log("errMsg: " + errMsg);
                this.setState({
                    data: [],
                    isLoading: false,
                    zipOrAddressError: errMsg,
                    address: ""
                    })
            });
    }

    renderSwitchIcon(param) {
        switch(param) {
            case 'partly-cloudy-day':
                return <img style={iconSize} src={partlyCloudDay} className="App-logo" alt="logo" />
            case 'partly-cloudy-night':
                return <img style={iconSize} src={partlyCloudNight} className="App-logo" alt="logo" />
            case 'clear-day':
                return <img style={iconSize} src={clearDay} className="App-logo" alt="logo" />
            case 'clear-night':
                return <img style={iconSize} src={clearNight} className="App-logo" alt="logo" />
            case 'rain':
                return <img style={iconSize} src={rain} className="App-logo" alt="logo" />
            case 'snow':
                return <img style={iconSize} src={snow} className="App-logo" alt="logo" />
            case 'sleet':
                return <img style={iconSize} src={sleet} className="App-logo" alt="logo" />
            case 'wind':
                return <img style={iconSize} src={wind} className="App-logo" alt="logo" />
            case 'fog':
                return <img style={iconSize} src={fog} className="App-logo" alt="logo" />
            case 'cloudy':
                return <img style={iconSize} src={cloudy} className="App-logo" alt="logo" />
        }
    }

    render() {
        return (
            <div>
                <MetaTags>
                    <meta property="viewport" content="width=device-width, initial-scale=1" />
                </MetaTags>
                <Typography variant="h2" className="headline">Weather Report</Typography>
                    <FormGroup row>
                        <Grid container justify="center">
                        <Grid footprint={3} style={gridMargin}>
                        {this.state.zipOrAddressError === "" ? (
                            <TextField
                                className={styles.textField}
                                id="zipOrAddress"
                                label="Zip"
                                value={this.state.zipOrAddress}
                                onChange={this.handleChange('zipOrAddress')}
                                margin="normal"
                                FormHelperTextProps={{ className: styles.helperText }}
                                helperText="92606, 90094,... etc"
                            />

                        ) : (
                            <TextField
                                error
                                className={styles.textField}
                                id="zipOrAddress"
                                label="Zip"
                                value={this.state.zipOrAddress}
                                onChange={this.handleChange('zipOrAddress')}
                                margin="normal"
                                FormHelperTextProps={{ className: styles.helperText }}
                                helperText={this.state.zipOrAddressError}
                            />
                        )}
                        </Grid>
                        <Grid footprint={3} style={gridMargin}>
                            <TextField
                                className={styles.textField}
                                id="weeksBehind"
                                label="Weeks Behind"
                                // value={this.state.weeksBehind}
                                defaultValue={this.state.weeksBehind}
                                onChange={this.handleChange('weeksBehind')}
                                margin="normal"
                                FormHelperTextProps={{ className: styles.helperText }}
                                helperText="1, 2 ,3..., etc"
                            />
                        </Grid>
                        <Grid footprint={1}>
                            <Fab
                                color="secondary"
                                className={styles.button}
                                style={this.state.zipOrAddress && this.state.weeksBehind ? { backgroundColor: '#00BCD4', color: '#FFFFFF' } : {}}
                                onClick={() => this.goFetchData()}
                                disabled={!this.state.zipOrAddress || !this.state.weeksBehind}
                            >
                                <SearchIcon />
                            </Fab>
                        </Grid>
                        </Grid>
                    </FormGroup>
                    <Typography variant="h4" className="tableTitle">{this.state.address}</Typography>
                <Table>
                { this.state.data.length != 0 ? (
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell></TableCell>
                            <TableCell >Temperature</TableCell>
                            <TableCell >Humidity</TableCell>
                            <TableCell >UV Index</TableCell>
                            <TableCell >Wind Speed(mph)</TableCell>
                        </TableRow>
                    </TableHead>
                ) : (<TableRow></TableRow>)}
                    { this.state.isLoading ?
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan="7" style={cellProgress}>
                                    <CircularProgress style={progress}/>
                            </TableCell>
                            </TableRow>
                        </TableBody> :
                        <TableBody>
                            {this.state.data.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{row.dayOfWeek}</TableCell>
                                    <TableCell >{row.date}</TableCell>
                                    <TableCell >
                                        {this.renderSwitchIcon(row.icon)}                                       
                                    </TableCell>                                   
                                    <TableCell >{Math.round( row.temperature )}&#8457;</TableCell>
                                    <TableCell >{Math.round( row.humidity * 100) +'%' }</TableCell>
                                    <TableCell >{row.uvIndex}</TableCell>
                                    <TableCell >{row.windSpeed}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    }
                </Table>
            </div>
        );
    }

}

export default App;
