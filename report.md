# POWER LIFTING PROJECT REPORT

---

## Introduction

For this project, our group analysed a dataset based on powerlifting performance. Powerlifting is a strength sport that focuses on three main lifts: squat, bench press, and deadlift. The final result is calculated by adding together the best successful attempt in each lift.

Because performance in this sport depends on multiple physical factors, it provides a strong example of how data analysis can be used to identify patterns and relationships.

The dataset used in this project contains over 200 records and includes several numerical variables such as age, bodyweight, squat, bench press, deadlift, total lift, and Wilks score. It also includes categorical information such as gender. This makes it suitable for descriptive statistical analysis, data visualisation, and basic machine learning, as required in the assignment guidelines.

---

## Project Brief

The goal of this report is to explain how the dataset was prepared, analyse key statistical findings, interpret visual trends, and apply a simple regression model to predict relative lifting performance using the Wilks score.

---

## Dataset Overview

The dataset shows individual powerlifting competitors and their competition results. Each row represents one athlete’s performance record.

The key variables include:

- Age  
- Bodyweight (kg)  
- Squat (kg)  
- Bench Press (kg)  
- Deadlift (kg)  
- Total Lift (kg)  
- Wilks Score  

The Total Lift value represents the combined result of the three lifts and is commonly used to rank athletes in competitions.

The dataset includes over 200 records and multiple analytical features, providing sufficient data to observe meaningful patterns. It covers a wide range of bodyweights and ages, allowing comparison across different types of powerlifters.

---

## Data Cleaning Process

Before analysis, the dataset was cleaned to ensure accuracy and consistency.

The cleaning steps included:

- Checking for missing values in key fields (Age, Bodyweight, lifts, Total, Wilks).
- Recalculating Total Lift where necessary by summing squat, bench press, and deadlift.
- Removing records with incomplete critical data to avoid errors in calculations.
- Converting incorrectly formatted text columns into numeric format.
- Checking for duplicate records to prevent double counting.
- Reviewing extreme values (outliers). In powerlifting, high totals can be realistic, so most extreme values were retained unless clearly invalid.

After cleaning, the dataset was consistent and ready for statistical analysis and modelling.

---

## Descriptive Statistics

Descriptive statistics were calculated to summarise the overall trends in the dataset. These included:

- Mean  
- Median  
- Minimum  
- Maximum  
- Standard Deviation  

The average bodyweight of athletes was approximately **82 kg**, with a wide range from under 50 kg to above 140 kg. The relatively high standard deviation reflects the presence of multiple weight classes.

For the lifts:

- Average Squat ≈ **165 kg**
- Average Bench Press ≈ **110 kg**
- Average Deadlift ≈ **185 kg**

This follows typical powerlifting patterns, as the deadlift generally allows athletes to lift more weight than the bench press.

The average Total Lift across all athletes was approximately **460 kg**, with some beginners significantly below this value and stronger competitors exceeding **700 kg**. This variation highlights the diversity in strength levels within the dataset.

In several cases, the mean was slightly higher than the median, suggesting that a small number of high-performing athletes increased the overall average.

---

## Visual Analysis

To better understand relationships within the data, several charts were created.

### Bodyweight vs Total Lift

A scatter plot showed a clear positive relationship between bodyweight and total lift. As bodyweight increases, total lifting performance generally increases as well. However, the relationship is not perfectly linear, indicating that bodyweight alone does not determine performance.

### Gender Comparison

A bar chart comparing average lift values between male and female athletes showed that males had higher absolute averages in squat, bench press, and deadlift. However, when considering bodyweight differences, the gap becomes less extreme, suggesting that relative strength may be more comparable than absolute strength.

### Age vs Performance

A visualisation of age versus total lift showed that performance generally increases through early adulthood, peaks in the late 20s or early 30s, and gradually declines afterward. This aligns with expected physical development and recovery patterns.

These charts supported the findings observed in the descriptive statistics and provided clearer visual interpretation of performance trends.

---

## Machine Learning Model(Bouchra Bahamida)

For the machine learning component, a **Linear Regression model** was implemented to predict the **Wilks score**.

Wilks is a continuous numerical value that measures strength relative to bodyweight. It was selected as the target variable because it provides a more meaningful performance indicator than total lift alone.

### Features Used

The model used the following input features:

- Age  
- Bodyweight (kg)  
- Best Squat (kg)  
- Best Bench Press (kg)  
- Best Deadlift (kg)  
- Total Lift (kg)  

Total Lift was included as a summary performance metric, while the individual lifts allowed the model to capture variations in how strength is distributed across different movements.

The dataset was split into:

- 80% training data  
- 20% testing data  

### Model Performance

The model was evaluated using:

- **Mean Absolute Error (MAE): 20.72**
- **R² Score: 0.904**

An R² value of 0.904 indicates that approximately 90.4% of the variation in Wilks scores can be explained by the selected features. The MAE of 20.72 indicates that predictions differ from actual Wilks values by an average of approximately 21 points.

Given the variability in athletic performance, this level of error is considered acceptable for a basic linear regression model.

---

## Visual Analysis of Machine Learning Results

### Actual vs Predicted Wilks

The scatter plot comparing actual and predicted Wilks values shows a strong positive relationship. Most points lie close to the diagonal trend line, indicating good predictive performance.

### Residual Analysis

The residual histogram (Actual − Predicted) shows that errors are generally centred around zero, suggesting no strong systematic bias.

### Feature Coefficients

The coefficient chart indicates:

- Total Lift has the strongest positive influence on Wilks.
- Bodyweight has a negative relationship with Wilks.
- Individual lifts contribute positively but with smaller magnitudes.
- Age has a relatively small influence.

The negative relationship between bodyweight and Wilks is consistent with how the Wilks formula adjusts performance relative to body mass.

---

## Limitations and Ethical Considerations

This analysis has several limitations:

- The dataset does not include information such as training experience, nutrition, or recovery.
- Some weight classes or age groups may be underrepresented.
- The model assumes a linear relationship and may not capture complex patterns.

From an ethical perspective, the dataset does not contain personal identifiers and is used solely for educational analysis.

---

## Conclusion

This project applied descriptive statistics, visual analysis, and linear regression to a powerlifting dataset.

The analysis identified a clear positive relationship between bodyweight and total lift. Descriptive statistics provided an overview of performance levels, while visualisations highlighted important trends.

The Linear Regression model demonstrated how Wilks score can be predicted using key performance variables, explaining approximately 90% of the variation in the dataset.

Overall, the project shows how statistical analysis and machine learning techniques can be applied to sports performance data to generate meaningful insights.