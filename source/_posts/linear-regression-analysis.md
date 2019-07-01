---
title: "[公式流]线性回归分析期中复习"
date: 2019-04-18 21:36:26
tags: ["线性回归分析"]
---

# Simple Linear Regression

## Model

$$Y_i=\beta_0+\beta_1X_i+\epsilon_i$$

## Hypothesis

- $\epsilon_i$ is independent
- $E\epsilon_i=0,\ Var(\epsilon_i)=\sigma^2$

With normal error:

- $\epsilon_i\ i.i.d.\sim N(0,\sigma^2)$

## Parameter Estimate

### method
- OLS
  $$\hat{\beta_0},\hat{\beta_1}=argmin_{\beta_0,\beta_1}\sum e_i=argmin_{\beta_0,\beta_1}\sum(Y_i-\beta_0-\beta_1X_i)^2$$
- MLE

### conclusion

$$\hat{\beta_1}=\frac{\sum(X_i-\bar{X})(Y_i-\bar{Y})}{\sum(X_i-\bar{X})^2}$$

$$\hat{\beta_0}=\bar{Y}-\hat{\beta_1}\bar{X}$$

$$\hat{\sigma^2}=MSE=\frac{SSE}{n-2}=\frac{\sum(\hat{Y_i}-Y_i)^2}{n-2}$$

$$E(s^2)=E(MSE)=\sigma^2$$

## Inference on $b_1$($\hat{\beta_1}$)
$$b_1=\frac{\sum(X_i-\bar{X})(Y_i-\bar{Y})}{\sum(X_i-\bar{X})^2}=\frac{\sum(X_i-\bar{X})(\beta_0+\beta_1X_i+\epsilon_i)}{\sum(X_i-\bar{X})^2}=\beta_1+\frac{\sum(X_i-\bar{X})\epsilon_i}{\sum(X_i-\bar{X})^2}$$

$$Eb_1=\beta_1,\ Var(b_1)=\frac{\sigma^2}{\sum(X_i-\bar{X})^2}$$

$$b_1\sim N(\beta_1,\frac{\sigma^2}{\sum(X_i-\bar{X})^2})$$

### Test $H_0:b_1=0$

$$T=\frac{b_1}{\sqrt{\frac{\hat{\sigma^2}}{\sum(X_i-\bar{X})^2}}}\sim t_{n-2}|H_0$$

$$F=\frac{MSR}{MSE}\sim F_{1;n-2}$$

$$F=T^2$$

## Prediction about $Y$

### $E(Y_h)$ ($\mu_h$)

$$\mu_h=E(Y_h)=\beta_0+\beta_1X_h$$

#### Estimation

$$\hat{\mu_h}=b_0+b_1X_h$$

$$E(\hat{\mu_h})=\mu_h,\ \sigma^2(\mu_h)=\sigma^2(\frac{1}{n}+\frac{(X_h-\bar{X})^2}{\sum(X_i-\bar{X})^2})$$

$$\hat{\mu_h}\sim N(\mu_h, \sigma^2(\mu_h))$$

#### Inference (Test & CI)
$$s^2(\mu_h)=s^2(\frac{1}{n}+\frac{(X_h-\bar{X})^2}{\sum(X_i-\bar{X})^2})$$

$$\frac{\hat{\mu_h}-\mu_h}{s(\hat{\mu_h})}\sim t_{n-2}$$

### $Y_{h(new)}$
$$Y_{h(new)}=\beta_0+\beta_1X_h+\epsilon\sim N(\beta_0+\beta_1X_h,\sigma^2)$$

#### Estimation

$$\hat{Y}_{h(new)}=b_0+b_1X_h+\epsilon=\hat{\mu}_h+\epsilon$$

$$E(\hat{Y}_{h(new)})=\mu_h,\ \sigma^2(\hat{Y}_{h(new)})=Var(\hat{\mu}_h)+Var(\epsilon)=\sigma^2(1+\frac{1}{n}+\frac{(X_h-\bar{X})^2}{\sum(X_i-\bar{X})^2})$$

#### Inference (Test & CI)