const puppeteer = require('puppeteer')
const express = require('express')
const Browser = require('./src/constructors/browser')

let browser = new Browser()
browser.addToWishlist()
