import express from 'express'
import build from './build'
import start from './start'

Promise.resolve(express())
  .then(build)
  .then(start)
  .catch(e => console.log(e))

