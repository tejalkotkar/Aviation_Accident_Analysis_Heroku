from sklearn import tree
import pandas as pd
from sklearn import preprocessing
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier

def damage():
    data_df = pd.read_csv('Data/Perfect_AviationData.csv') 
    
    # Define Target (Also called as Y)
    target = data_df["Aircraft_Damage"]

    #  Encode Target values for Random Forest Model
    ## Get the unique list of Severity
    unique_target = list(data_df["Aircraft_Damage"].unique())

    # Create an encoder and fit on unique values
    target_encoder = preprocessing.LabelEncoder()
    target_encoder.fit(unique_target)

    # Transform all target values with encoder and store as list
    ecoded_target_list = list(target_encoder.transform(target))

    # Create a final_target with encoded values
    encoded_target_df = pd.DataFrame({"Aircraft_Damage" : ecoded_target_list})
    final_target = encoded_target_df["Aircraft_Damage"]
    
    # Define the input value columns(also called as X)
    data = data_df[[
                'Injury_Severity', 'Aircraft_Category', 'Make',
                'Total_Fatal_Injuries', 'Total_Serious_Injuries',
                'Total_Minor_Injuries', 'Total_Uninjured', 'Broad_Phase_of_Flight'
                ]]
    
    # List of column names which has string values
    col_list = ['Injury_Severity', 'Aircraft_Category', 'Make', 'Broad_Phase_of_Flight']

    # Iterate through each column in col_list and create a encoded values for that column
    for col in col_list:
        # Get the list of unique values from column
        unique = list(data[col].unique())
        
        # Create a LabelEncoder
        encoder = preprocessing.LabelEncoder()
        
        # Store the encoder in unique variable depending on the column name
        if col == 'Injury_Severity':
            le_Injury_Severity = encoder
            
        elif col == 'Aircraft_Category':
            le_Aircraft_Category = encoder
            
        elif col == 'Make':
            le_Make = encoder
            
        elif col == 'Broad_Phase_of_Flight':
            le_Broad_Phase_of_Flight = encoder
            
        # Fit the encoder on unique values 
        encoder.fit(unique)
        
        # Get the column values to list
        col_data_list = data[col].tolist()
        
        # Transform column values to encoded form
        ecoded_list = list(encoder.transform(col_data_list))
        
        # Add encoded values as new column in df
        new_col_name = col+'_Encoded'
        data[new_col_name] = ecoded_list
    
    # Creating final_data df with only required(Numeric value) columns 
    final_data = data[[
                'Injury_Severity_Encoded', 'Aircraft_Category_Encoded',
                'Make_Encoded', 'Total_Fatal_Injuries',
                'Total_Serious_Injuries', 'Total_Minor_Injuries',
                'Total_Uninjured', 'Broad_Phase_of_Flight_Encoded'
                ]]
    
    # Perform train test split for random forest regression
    X_train_random, X_test_random, y_train_random, y_test_random = train_test_split(final_data, final_target, random_state=42)

    # Scale data using StandardScalar
    X_scaler_random = StandardScaler().fit(X_train_random)

    # Transform X values (Train & Test) with the scalar
    X_train_random_scaled = X_scaler_random.transform(X_train_random)
    # X_test_random_scaled = X_scaler.transform(X_test_random)

    rf = RandomForestClassifier(n_estimators=200)
    rf = rf.fit(X_train_random_scaled, y_train_random)

    print(f"Testing Data Score: {rf.score(X_test_random, y_test_random)}")
    print(f"Training Data Score: {rf.score(X_train_random, y_train_random)}")

    return(rf, le_Injury_Severity, le_Aircraft_Category, le_Make, le_Broad_Phase_of_Flight, target_encoder)