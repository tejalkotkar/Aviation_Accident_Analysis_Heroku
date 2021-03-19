d3.csv("static/Data/Final_Clean_AviationData_US.csv").then(function(Aviationdata) {

    var ThreeYears = Aviationdata.filter(function(data){
        var st = data.Event_Date;
        var dt = new Date(st);
        year = dt.getFullYear();
        return (year == 2020 || year == 2019 || year == 2018);
    });

    // ===================== Prepare Data for Aircraft Category =====================
    var Air_Category = ThreeYears.map(event => event.Aircraft_Category)

    var Air_Category_final = Air_Category.filter(function(cat) {
        return cat != "Unknown";
    });

    // Get only unique values
    var unique_category = [...new Set(Air_Category_final)];
    
    console.log(unique_category);

    // count of events/accidents with specific make
    cat_specific_count = []

    unique_category.forEach(function(cat){
        var cat_spec_array = ThreeYears.filter(data => data.Aircraft_Category == cat);
    
        dict = {
            "Aircraft_Category" : cat,
            "Accident_Count" : cat_spec_array.length
        };
    
        cat_specific_count.push(dict);
    });
    
    cat_specific_count.sort((a,b) => b.Accident_Count - a.Accident_Count);
    var Category_Data = cat_specific_count.slice(0,10);
    console.log(Category_Data);
    
    // Get the values & labels for pie chart
    cat_labels = Category_Data.map(a => a.Aircraft_Category);
    cat_values = Category_Data.map(a => a.Accident_Count);
    top_cat = cat_labels[0];

    // ===================== Prepare Data for MAKE =====================
    // Get all Makes in lowercase
    var Air_Make = ThreeYears.map(function(event){
        var make = event.Make;
        return make.toLowerCase();
    });

    // Get only unique values
    var unique_make = [...new Set(Air_Make)];
    
    // count of events/accidents with specific make
    make_specific_count = []

    unique_make.forEach(function(make){
        var make_spec_array = ThreeYears.filter(function(data){
            var AirMake = data.Make;
            return ((AirMake.toLowerCase() == make)&& (data.Aircraft_Category == top_cat));
        });

        dict = {
            "Make" : make,
            "Accident_Count" : make_spec_array.length
        };

        make_specific_count.push(dict);
    });

    make_specific_count.sort((a,b) => b.Accident_Count - a.Accident_Count);
    var Make_Data = make_specific_count.slice(0,10);
    

    // Get the values & labels for pie chart
    make_labels = Make_Data.map(a => a.Make);
    make_values = Make_Data.map(a => a.Accident_Count);
    top_make = make_labels[0];


    // ===================== Prepare Data for MODEL =====================

    // Get all Model in lowercase
    var Air_Model = ThreeYears.map(function(event){
        var model = event.Model;
        return model.toLowerCase();
    });

    // Get only unique values
    var unique_model = [...new Set(Air_Model)];

    var model_specific_count = [];

    unique_model.forEach(function(model){
        // var make;
        var model_spec_array = ThreeYears.filter(function(data){
            var AirModel = data.Model;
            var AirMake = data.Make;
            return ((AirModel.toLowerCase() == model) && (AirMake.toLowerCase() == top_make));
        });

        dict = {
            "Model" : model,
            "Accident_Count" : model_spec_array.length
        };

        model_specific_count.push(dict);
    });

    model_specific_count.sort((a,b) => b.Accident_Count - a.Accident_Count);
    var Model_Data = model_specific_count.slice(0,10);
    // console.log(Model_Data);

    // Get the values & labels for pie chart
    model_labels = Model_Data.map(a => a.Model);
    model_values = Model_Data.map(a => a.Accident_Count);

    // ================================= Plotting all Pie plots ========================
    var layout = {
        height: 400,
        width: 500
      };
      
    var data_cat = [{
        values: cat_values,
        labels: cat_labels,
        hoverinfo: 'skip',
        type: 'pie'
      }];
      

    Plotly.newPlot('pie11', data_cat, layout);

    //======== Second plot ============

    var data_make = [{
        values: make_values,
        labels: make_labels,
        hoverinfo: 'skip',
        type: 'pie'
      }];
      

      Plotly.newPlot('pie12', data_make, layout);

    //======== Third plot ============

    var data_model = [{
        values: model_values,
        labels: model_labels,
        hoverinfo: 'skip',
        type: 'pie'
      }];
      
      
      Plotly.newPlot('pie13', data_model, layout);

});
