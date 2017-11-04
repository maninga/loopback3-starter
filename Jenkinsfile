properties([[$class: 'jenkins.model.BuildDiscarderProperty', strategy: [$class: 'LogRotator', numToKeepStr: '5']]])
node {

	try {
		stage('Checkout') {
			checkout scm
		}

		stage('SET_ENV') {
			def node = tool 'node7'
			env.PATH = "${node}/bin:${env.PATH}"
			env.NODE_PATH="${node}/lib/node_modules:."
		}

		def ci_branches =  ['integration', 'preprod', 'production']

		if (ci_branches.contains(env.BRANCH_NAME)) {
			stage('Build') {
				sh 'scripts/build.sh'
				sh 'dd-srvcommon/scripts/update-db.sh'
			}
			stage('Deploy') {
				sh "dd-srvcommon/scripts/deploy-util.sh --application blog --branch ${env.BRANCH_NAME}"
			}
		}

		slackSend color:'good', message: "Successfuly deployed  ${env.JOB_NAME}"
	} catch (e) {
		slackSend color:'danger', message: "Error in build+deploy ${env.JOB_NAME} ${e}"
	}
}
