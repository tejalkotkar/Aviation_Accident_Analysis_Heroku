from flask import Flask, request, render_template
import Type_Predict_Model
import Severity_Predict_Model
import Damage_Predict_Model


#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Get models and encoders for all three predictions.
#################################################
# Predicting whether its a Incident or Accident
rf1, le_Injury_Severity1, le_Aircraft_Damage1, target_encoder1 = Type_Predict_Model.Acc_type()

# Predicting whats the severity of the accident can be
classifier2, le_Aircraft_Damage2, le_Aircraft_Category2, le_Broad_Phase_of_Flight2 = Severity_Predict_Model.severity()

# Predicting what severe aircraft damage be
rf3, le_Injury_Severity3, le_Aircraft_Category3, le_Make3, le_Broad_Phase_of_Flight3, target_encoder3 = Damage_Predict_Model.damage()

# #################################################
# # Flask Routes
# #################################################

@app.route("/")
def welcome():
    return render_template('index.html')

@app.route("/type_prediction", methods=['POST'])
def type_prediction():
    # # DEFINE SAMPLE NEW DATA
    Injury_Severity = request.form.get("Injury_Severity")
    Aircraft_Damage = request.form.get("Aircraft_damage")
    Total_Fatal_Injuries = request.form.get("Fatal_Injury")
    Total_Serious_Injuries = request.form.get("Serious_Injury")
    Total_Minor_Injuries = request.form.get("Minor_Injury")
    Total_Uninjured = request.form.get("Uninjured")

    # Encode input values which are in string format
    Injury_Severity_encoded = le_Injury_Severity1.transform([Injury_Severity])
    Aircraft_Damage_encoded = le_Aircraft_Damage1.transform([Aircraft_Damage])

    # Create a list of input values
    new_data = [[Injury_Severity_encoded[0], Aircraft_Damage_encoded[0], Total_Fatal_Injuries, Total_Serious_Injuries, Total_Minor_Injuries, Total_Uninjured]]

    # Predict the output value on the new data
    y_predict_encoded = rf1.predict(new_data)

    # Decode the newly predicted value with target_encode
    y_type_prediction = target_encoder1.inverse_transform(y_predict_encoded)

    return render_template('index.html', type_predict=y_type_prediction[0])

@app.route("/severity_prediction", methods=['POST'])
def severity_prediction():
    # DEFINE SAMPLE NEW DATA
    Aircraft_Damage = request.form.get("Aircraft_damage")
    Aircraft_Category = request.form.get("Aircraft_Category")
    Total_Fatal_Injuries = request.form.get("Fatal_Injury")
    Total_Serious_Injuries = request.form.get("Serious_Injury")
    Total_Minor_Injuries = request.form.get("Minor_Injury")
    Total_Uninjured = request.form.get("Uninjured")
    Broad_Phase_of_Flight = request.form.get("Board_phase")

    
    # Encode input values which are in string format
    Aircraft_Damage_encoded = le_Aircraft_Damage2.transform([Aircraft_Damage])
    Aircraft_Category_encoded = le_Aircraft_Category2.transform([Aircraft_Category])
    Broad_Phase_of_Flight_encoded = le_Broad_Phase_of_Flight2.transform([Broad_Phase_of_Flight])
    
    # Create a list of input values
    new_data = [[Aircraft_Damage_encoded[0], Aircraft_Category_encoded[0], Total_Fatal_Injuries, Total_Serious_Injuries, Total_Minor_Injuries, Total_Uninjured, Broad_Phase_of_Flight_encoded]]

    # Predict the output value on the new data
    y_severity_prediction = classifier2.predict(new_data)

    return render_template('index.html', severity_predict = y_severity_prediction[0])

@app.route("/damage_prediction", methods=['POST'])
def damage_prediction():
    # # # DEFINE SAMPLE NEW DATA
    Injury_Severity = request.form.get("Injury_Severity")
    Aircraft_Category = request.form.get("Aircraft_cat")
    Make = request.form.get("Aircraft_make")
    Total_Fatal_Injuries = request.form.get("Fatal_Injury")
    Total_Serious_Injuries = request.form.get("Serious_Injury")
    Total_Minor_Injuries = request.form.get("Minor_Injury")
    Total_Uninjured = request.form.get("Uninjured")
    Broad_Phase_of_Flight = request.form.get("Board_phase")

    
    # Encode input values which are in string format
    Injury_Severity_encoded = le_Injury_Severity3.transform([Injury_Severity])
    Aircraft_Category_encoded = le_Aircraft_Category3.transform([Aircraft_Category])
    Make_encoded = le_Make3.transform([Make])
    Phase_encoded = le_Broad_Phase_of_Flight3.transform([Broad_Phase_of_Flight])

    # Create a list of input values
    new_data = [[Injury_Severity_encoded[0], Aircraft_Category_encoded[0],
                 Make_encoded[0], Total_Fatal_Injuries,
                 Total_Serious_Injuries, Total_Minor_Injuries,
                 Total_Uninjured, Phase_encoded[0]]]

    y_predict_encoded = list(rf3.predict(new_data))
    damage_y_prediction = target_encoder3.inverse_transform(y_predict_encoded)
    
    # rf, le_Injury_Severity, le_Aircraft_Category, le_Make, le_Broad_Phase_of_Flight, target_encoder
    return render_template('index.html', damage_predict=damage_y_prediction[0])

@app.route("/abt_data")
def abt_data():
    return render_template('abt_data.html')

@app.route("/accident_distribution")
def accident_distribution():
    return render_template('accident_distribution.html')

@app.route("/accidents_injuries")
def accidents_injuries():
    return render_template('accidents_injuries.html')

@app.route("/make_model")
def make_model():
    return render_template('make_model.html')

@app.route("/accidents_purpose")
def accidents_purpose():
    return render_template('accidents_purpose.html')

@app.route("/Damage_Phase")
def Damage_Phase():
    return render_template('Damage_Phase.html')

@app.route("/map")
def map():
    return render_template('map.html')

if __name__ == '__main__':
    app.run(debug=True)