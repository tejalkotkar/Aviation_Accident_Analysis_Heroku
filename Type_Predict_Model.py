from sklearn import tree
import pandas as pd
from sklearn import preprocessing
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier

def Acc_type():

    # path = os.path.join("")
    data_df = pd.read_csv('Data/Perfect_AviationData.csv') 
    data_df = data_df.dropna()
    # print(data_df.head(10))

    # Define target (Also called as Y)
    target = data_df["Investigation_Type"]

    #  Encode Target values for Random Forest Model

    ## Get the unique list of Investigation_type
    unique_target = list(data_df["Investigation_Type"].unique())

    # Create an encoder and fit on unique values
    target_encoder = preprocessing.LabelEncoder()
    target_encoder.fit(unique_target)

    # Transform all target values with encoder and store as list
    ecoded_target_list = list(target_encoder.transform(target))

    # Create a final_target with encoded values
    encoded_target_df = pd.DataFrame({"Investigation_Type" : ecoded_target_list})
    final_target = encoded_target_df["Investigation_Type"]

    # Define the input value columns(also called as X)
    data = data_df[['Injury_Severity', 'Aircraft_Damage', 'Total_Fatal_Injuries',
                    'Total_Serious_Injuries', 'Total_Minor_Injuries', 
                    'Total_Uninjured']]

    # List of column names which has string values
    col_list = ['Injury_Severity', 'Aircraft_Damage']

    # Iterate through each column in col_list and create a encoded values for that column
    for col in col_list:
        # Get the list of unique values from column
        unique = list(data[col].unique())
        
        # Create a LabelEncoder
        encoder = preprocessing.LabelEncoder()
        
        # Store the encoder in unique variable depending on the column name
        if col == 'Injury_Severity':
            le_Injury_Severity = encoder
            
        elif col == 'Aircraft_Damage':
            le_Aircraft_Damage = encoder
        
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
                    'Injury_Severity_Encoded', 'Aircraft_Damage_Encoded', 
                    'Total_Fatal_Injuries', 'Total_Serious_Injuries',
                    'Total_Minor_Injuries', 'Total_Uninjured'
                    ]]

    # Perform train test split for random forest regression
    
    X_train_random, X_test_random, y_train_random, y_test_random = train_test_split(final_data, final_target, random_state=42)

    # Scale data using StandardScalar
    X_scaler_random = StandardScaler().fit(X_train_random)

    # Transform X values (Train & Test) with the scalar
    X_train_random_scaled = X_scaler_random.transform(X_train_random)
    # X_test_random_scaled = X_scaler_random.transform(X_test_random)

    rf = RandomForestClassifier(n_estimators=200)
    rf = rf.fit(X_train_random_scaled, y_train_random)

    print(f"Testing Data Score: {rf.score(X_test_random, y_test_random)}")
    print(f"Training Data Score: {rf.score(X_train_random, y_train_random)}")

    return (rf, le_Injury_Severity, le_Aircraft_Damage, target_encoder)