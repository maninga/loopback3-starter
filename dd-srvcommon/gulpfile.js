/**
 *
 * dd-srvcommon build file
 * @author Ashwini Kumar (ashwini.kumar@dd.com)
 *
 */
/* eslint one-var: 0 */
/* eslint no-console: 0 */

'use strict';

process.on('exit', () => {
  console.info('Going to Exit from gulp process');
});

process.on('uncaughtException', (err) => {
  console.error('ERROR: Caught exception:', err);
  console.error('Stack Trace:', err.stack);
  process.exit(255);
});

const path         = require('path'),
      fs           = require('fs'),
      gulp         = require('gulp'),
      gulpIf       = require('gulp-if'),
      eslint       = require('gulp-eslint'),
      chalk        = require('chalk'),
      nodemon      = require('gulp-nodemon'),
      gulpSequence = require('gulp-sequence');

var serverModelJSFiles   = ['../common/models/**/*.js'],
    serverModelJSONFiles = ['../common/models/**/*.json'],
    serverJSFiles        = serverModelJSFiles.concat([
      './*.js',
      './config/*.js',
      './config/**/*.js',
      './middleware/*.js',
      './boot/*.js',
      './utils/*.js',
      '../server/**/*.js'
    ]),
    serverJSONFiles      = serverModelJSONFiles.concat([
      './*.json',
      './config/*.json',
      './config/**/*.json',
      '../server/**/*.json'
    ]),
    configJSONFiles      = [
      './.eslintrc.json',
      './package.json',
      '../package.json'
    ],
    allJSONFiles         = serverJSONFiles.concat(configJSONFiles); // eslint-disable-line no-unused-vars

gulp.on('err', function (err) {
  console.error('on gulp error', err);
  process.exit(254);
});

/* ESLint related task - Begin */

var fixedFilesList = [];

function isESLintFixedApplied(file) {
  if (file.eslint && file.eslint.fixed) {
    //console.info('inside isESLintFixedApplied', file.path, '::', file.eslint.fixed);
    fixedFilesList.push(file.path);
    return true;
  }
}

gulp.task('es-lint', function () {
  return gulp.src(serverJSFiles)
    .pipe(eslint({
      fix: true,
      debug: true,
      warnFileIgnored: true,
      configFile: './.eslintrc.json'
    }))
    .pipe(eslint.results(function (results) {
      // Called once for all ESLint results.
      console.info(chalk.underline.bgYellow('ESLint Summary:'));
      console.info(chalk.bgYellow('\t\tTotal Files: ' + results.length));
      console.info(chalk.bgYellow.red('\t\tTotal Warnings: ' + results.warningCount));
      console.info(chalk.bgYellow.red('\t\tTotal Errors: ' + results.errorCount));
    }))
    .pipe(eslint.format())
    .pipe(gulpIf(isESLintFixedApplied, gulp.dest(function (file) {
      return file.base;
    })))
    .pipe(eslint.failAfterError());
});

gulp.task('validate-es-lint-changes', function () {
  if (fixedFilesList.length > 0) {
    console.info(chalk.red('The changed files which are pending for your review and are to be staged:',
      fixedFilesList));
    process.exit(253);
  }
});

/* ESLint related task - End */

gulp.task('lint', gulpSequence('es-lint', 'validate-es-lint-changes'));

/**
 * nodemon/watch related tasks - Begin
 */

/**
 * starting the node server and watch changes to restart the server.
 */
gulp.task('nodemon', function () {
  nodemon({
    script: './server.js',
    ext: 'js json',
    verbose: true,
    ignore: ['../node_modules', '../git'],
    watch: ['../common/models', './../server',
      './config', '!./config/env', './middleware', './boot', './utils',
      'log-manager.js', 'server.js'],
    env: {NODE_ENV: process.env.NODE_ENV || 'development'}
  })
  /*.on('restart', function (files) {
      console.info(chalk.green('============================================='));
      console.info(chalk.green('Changed Files:'), files.join(', '));
      console.info(chalk.green('Restarging Server'));
      console.info(chalk.green('============================================='));
    })*/;
});

/**
 *
 * Public Exposed Gulp TASK
 *
 */
//called by git-pre-commit-hook --> npm run beforecommit
gulp.task('precommit', ['lint']);

gulp.task('devserver', ['nodemon']);
