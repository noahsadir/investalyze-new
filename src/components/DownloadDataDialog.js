import '../App.css';
import React from "react";
import { withStyles } from '@material-ui/core/styles';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core/';

export default class DisclaimerDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionsChainCSVLink: '#',
    }
  }

  render() {

    const handleClose = (event) => {
      if (this.props.onClose != null) {
        this.props.onClose(true);
      }
    }

    const handleJSONButton = (type) => {
      if (type == "options_chain" && this.props.data.optionsChain != null) {
        downloadData(JSON.stringify(this.props.data.optionsChain.rawData), "options_chain.json", "application/json");
      } else if (type == "options_chain_processed" && this.props.data.optionsChain != null) {
        var dateSortedData = this.props.data.optionsChain.dateSortedData;
        for (var optionType in dateSortedData) {
          for (var optionDate in dateSortedData[optionType]) {
            for (var singleOptionIndex in dateSortedData[optionType][optionDate]) {
              dateSortedData[optionType][optionDate][singleOptionIndex] = dateSortedData[optionType][optionDate][singleOptionIndex].allData;
            }
          }
        }
        downloadData(JSON.stringify(dateSortedData), "options_chain_processed.json", "application/json");
      } else if (type == "company_quote" && this.props.data.companyQuote != null) {
        downloadData(JSON.stringify(this.props.data.companyQuote), "company_quote.json", "application/json");
      } else if (type == "stock_historical" && this.props.data.underlyingHistorical != null) {
        downloadData(JSON.stringify(this.props.data.underlyingHistorical.rawData), "stock_historical.json", "application/json");
      } else if (type == "stock_historical_processed" && this.props.data.underlyingHistorical != null) {
        downloadData(JSON.stringify(this.props.data.underlyingHistorical.jsonData), "stock_historical_processed.json", "application/json");
      }
    }

    const handleCSVButton = (type) => {
      if ((type == "options_chain" || type == "options_chain_processed") && (this.props.open && this.props.data.optionsChain != null)) {
        var valueNames = [
          "id",
          "description",
          "type",
          "strike",
          "expiration",
          "time_to_expiration",
          "spot",
          "bid",
          "mark",
          "ask",
          "last_price",
          "last_trade",
          "bid_ask_spread",
          "intrinsic_value",
          "extrinsic_value",
          "price_change",
          "percent_change",
          "volume",
          "open_interest",
          "implied_volatility",
          "delta",
          "gamma",
          "vega",
          "theta",
          "rho",
          "open_interest_value",
          "open_interest_intrinsic",
          "open_interest_extrinsic",
          "annual_extrinsic_value",
          "annual_extrinsic_percent",
          "leverage_ratio"
        ];

        if (type == "options_chain") {
          valueNames = [
            "id",
            "description",
            "type",
            "strike",
            "expiration",
            "bid",
            "ask",
            "last_price",
            "last_trade",
            "price_change",
            "percent_change",
            "volume",
            "open_interest",
            "implied_volatility",
            "delta",
            "gamma",
            "vega",
            "theta",
            "rho",
          ];
        }

        var dateSortedData = this.props.data.optionsChain.dateSortedData;
        var csvData = "";
        for (var index in valueNames) {
          csvData += valueNames[index] + ",";
        }

        //Loop through nest of JSON to get each SingleOption object
        for (var type in dateSortedData) {
          for (var date in dateSortedData[type]) {
            for (var singleOptionIndex in dateSortedData[type][date]) {

              //Get data for specific option and add to data
              var singleOptionData = dateSortedData[type][date][singleOptionIndex].allData;
              var csvLine = "";
              for (var index in valueNames) {
                var dataKey = valueNames[index];
                if (singleOptionData[dataKey] != null) {
                  csvLine += singleOptionData[dataKey] + ",";
                } else {
                  csvLine += ",";
                }

              }
              csvData = csvData + "\n" + csvLine;
            }
          }
        }

        downloadData(csvData, "options_chain.csv", "text/csv");
      } else if (type == "stock_historical_processed" && this.props.data.underlyingHistorical != null) {
        downloadData(this.props.data.underlyingHistorical.csvData, "stock_historical.csv", "text/csv");
      }
    }

    var buttonStyle = {
      margin: 8
    }

    return (
      <Dialog
        open={this.props.open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Download Data"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Some data may be unavailable until symbol has loaded.
          </DialogContentText>
          <div style={{display: "flex"}}>
            <div style={{display: "flex", flex: "1 0 0", flexFlow: "column"}}>
              <div style={{display: "flex", flex: "1 0 0"}}>
                <p style={{whiteSpace: "nowrap", paddingRight: 16}}>Options Chain (Raw Data)</p>
              </div>
              <div style={{display: "flex", flex: "1 0 0"}}>
                <p style={{whiteSpace: "nowrap", paddingRight: 16}}>Stock Historical (Raw Data)</p>
              </div>
              <div style={{display: "flex", flex: "1 0 0"}}>
                <p style={{whiteSpace: "nowrap", paddingRight: 16}}>Options Chain (Processed)</p>
              </div>
              <div style={{display: "flex", flex: "1 0 0"}}>
                <p style={{whiteSpace: "nowrap", paddingRight: 16}}>Stock Historical (Processed)</p>
              </div>
              <div style={{display: "flex", flex: "1 0 0"}}>
                <p style={{whiteSpace: "nowrap", paddingRight: 16}}>Company Quote</p>
              </div>
            </div>
            <div style={{display: "flex", flex: "1 0 0", flexFlow: "column"}}>
              <div style={{display: "flex", flex: "1 0 0"}}>
                <Button disabled={this.props.data.optionsChain == null} onClick={() => handleJSONButton("options_chain")} color={"secondary"} variant="contained" style={buttonStyle}>JSON</Button>
              </div>
              <div style={{display: "flex", flex: "1 0 0"}}>
                <Button disabled={this.props.data.underlyingHistorical == null} onClick={() => handleJSONButton("stock_historical")} color={"secondary"} variant="contained" style={buttonStyle}>JSON</Button>
              </div>
              <div style={{display: "flex", flex: "1 0 0"}}>
                <Button disabled={this.props.data.optionsChain == null} onClick={() => handleJSONButton("options_chain_processed")} color={"secondary"} variant="contained" style={buttonStyle}>JSON</Button>
              </div>
              <div style={{display: "flex", flex: "1 0 0"}}>
                <Button disabled={this.props.data.underlyingHistorical == null} onClick={() => handleJSONButton("stock_historical_processed")} color={"secondary"} variant="contained" style={buttonStyle}>JSON</Button>
              </div>
              <div style={{display: "flex", flex: "1 0 0"}}>
                <Button disabled={this.props.data.companyQuote == null} onClick={() => handleJSONButton("company_quote")} color={"secondary"} variant="contained" style={buttonStyle}>JSON</Button>
              </div>
            </div>
            <div style={{display: "flex", flex: "1 0 0", flexFlow: "column"}}>
              <div style={{display: "flex", flex: "1 0 0"}}>
                <Button disabled={this.props.data.optionsChain == null} onClick={() => handleCSVButton("options_chain")} color={"secondary"} variant="contained" style={buttonStyle}>CSV</Button>
              </div>
              <div style={{display: "flex", flex: "1 0 0"}}>
              </div>
              <div style={{display: "flex", flex: "1 0 0"}}>
                <Button disabled={this.props.data.optionsChain == null} onClick={() => handleCSVButton("options_chain_processed")} color={"secondary"} variant="contained" style={buttonStyle}>CSV</Button>
              </div>
              <div style={{display: "flex", flex: "1 0 0"}}>
                <Button disabled={this.props.data.underlyingHistorical == null} onClick={() => handleCSVButton("stock_historical_processed")} color={"secondary"} variant="contained" style={buttonStyle}>CSV</Button>
              </div>
              <div style={{display: "flex", flex: "1 0 0"}}>

              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button value={true} onClick={handleClose} color={this.props.accentColor}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

//https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react/44661948
function downloadData(fileData, fileName, mimeType) {
  const element = document.createElement("a");
  const file = new Blob([fileData], {type: mimeType});
  element.href = URL.createObjectURL(file);
  element.download = fileName;
  document.body.appendChild(element);
  element.click();
}
