// Creating References to load dropdown
// References for Incident Prediction
var inc_Sev = d3.select("#inc_Sev");
var inc_Damage = d3.select("#inc_Damage");

// References for Aircraft Damage
var damage_Sev = d3.select("#damage_Sev");
var damage_Cat = d3.select("#damage_Cat");
var damage_Make = d3.select("#damage_Make");
var damage_Phase = d3.select("#damage_Phase");

// References for Accident Severity
var sev_Damage = d3.select("#sev_Damage");
var sev_Cat = d3.select("#sev_Cat");
var sev_Phase = d3.select("#sev_Phase");

// Function to get the invoked when page loads.
init=()=>{
    // fetch the data from CSV
    d3.csv("static/Data/Perfect_AviationData.csv").then(function(Aviationdata) {
        console.log(Aviationdata);
        
        // Get the unique values for below attributes in differnt array
        // Injury Severity
        var Injury_Sev = [...new Set(Aviationdata.map(event => event.Injury_Severity))];
        console.log(Injury_Sev);

        var Air_damage = [...new Set(Aviationdata.map(event => event.Aircraft_Damage))];
        console.log(Air_damage);

        var Air_Make = [...new Set(Aviationdata.map(event => event.Make))];
        console.log(Air_Make);

        var Air_Cat = [...new Set(Aviationdata.map(event => event.Aircraft_Category))];
        console.log(Air_Cat)

        var Board_Phase = [...new Set(Aviationdata.map(event => event.Broad_Phase_of_Flight))];
        console.log(Board_Phase)

        // // Load all dropdowns
        Injury_Sev.unshift("Select Severity");
        Injury_Sev.forEach(sev => {
            inc_Sev.append("option").attr("value",sev).text(sev);
            damage_Sev.append("option").attr("value",sev).text(sev);
        });
        
        Air_damage.unshift("Select Damage");
        Air_damage.forEach(damage => {
            inc_Damage.append("option").attr("value",damage).text(damage);
            sev_Damage.append("option").attr("value",damage).text(damage);
        });
        
        Air_Make.unshift("Select Make");
        Air_Make.forEach(make => {
            damage_Make.append("option").attr("value",make).text(make);
        });
        
        Air_Cat.unshift("Select Category");
        Air_Cat.forEach(cat => {
            damage_Cat.append("option").attr("value",cat).text(cat);
            sev_Cat.append("option").attr("value",cat).text(cat);
        });
        
        Board_Phase.unshift("Select Phase");
        Board_Phase.forEach(phase => {
            damage_Phase.append("option").attr("value",phase).text(phase);
            sev_Phase.append("option").attr("value",phase).text(phase);
        });
        

    });
}

// Load init function

init()