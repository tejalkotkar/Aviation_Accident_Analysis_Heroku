from sklearn import tree
import pandas as pd
from sklearn import preprocessing
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

def severity():

    data_df = pd.read_csv('Data/Perfect_AviationData.csv') 
    data_df = data_df.rename(columns = {'Injury_Severity' : 'Severity'})

    # Define Target (Also called as Y)
    target = data_df["Severity"]

    # Define the input value columns(also called as X)
    data = data_df[['Aircraft_Damage', 'Aircraft_Category', 
                    'Total_Fatal_Injuries', 'Total_Serious_Injuries',
                    'Total_Minor_Injuries', 'Total_Uninjured', 'Broad_Phase_of_Flight'
                    ]]
    
    # List of column names which has string values
    col_list = ['Aircraft_Damage', 'Aircraft_Category' , 'Broad_Phase_of_Flight']

    # Iterate through each column in col_list and create a encoded values for that column
    for col in col_list:
        # Get the list of unique values from column
        unique = list(data[col].unique())
        
        # Create a LabelEncoder
        encoder = preprocessing.LabelEncoder()
        
        # Store the encoder in unique variable depending on the column name
        if col == 'Aircraft_Damage':
            le_Aircraft_Damage = encoder
            
        elif col == 'Aircraft_Category':
            le_Aircraft_Category = encoder
            
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
    final_data = data[['Aircraft_Damage_Encoded', 'Aircraft_Category_Encoded', 
                       'Total_Fatal_Injuries', 'Total_Serious_Injuries',
                       'Total_Minor_Injuries', 'Total_Uninjured',
                       'Broad_Phase_of_Flight_Encoded'
                        ]]
    
    # Perform train test split for logistic regression
    X_train, X_test, y_train, y_test = train_test_split(final_data, target, random_state=42)

    # Scale data using StandardScalar
    X_scaler = StandardScaler().fit(X_train)

    # Transform X values (Train & Test) with the scalar
    X_train_scaled = X_scaler.transform(X_train)
    # X_test_scaled = X_scaler.transform(X_test)

    classifier = LogisticRegression(max_iter=10000)
    classifier.fit(X_train_scaled, y_train)

    print(f"Training Data Score: {classifier.score(X_train, y_train)}")
    print(f"Testing Data Score: {classifier.score(X_test, y_test)}")

    return(classifier, le_Aircraft_Damage, le_Aircraft_Category, le_Broad_Phase_of_Flight)