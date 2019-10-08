# Copyright Proudsmart.com. 2015-2016
#
# Author: Jia Zhao
#

BUILD_TOP_DIR=$(shell pwd)
RELEASE_DIR=${BUILD_TOP_DIR}/release

BUILD_NUM=$(shell date '+%y%m%d-%H%M%S')

pre: 
	@echo "====================================================="
	@echo "Pre-checking ..."
	@echo "====================================================="
	which npm > /dev/null 2>&1
	if [ "$$?" != "0" ]; then \
		echo "Failed, no npm command found! Please install nodejs..."; \
		exit -1;\
	fi
    
clean:
	@echo "====================================================="
	@echo "Clean Build Environment ..."
	@echo "====================================================="
	-rm -rf ${RELEASE_DIR}
    
init: clean
	@echo "====================================================="
	@echo "Init Build Environment ..."
	@echo "====================================================="
	cd ${BUILD_TOP_DIR};
	#npm install --registry=https://registry.npm.taobao.org
	npm install

daily: pre init
	npm run build
	cp -rf ${BUILD_TOP_DIR}/ps-vue-baogang/build ${RELEASE_DIR}
	#cp -rf ${BUILD_TOP_DIR}/node_modules ${BUILD_TOP_DIR}/bower_components ${RELEASE_DIR}
	@echo "====================================================="
	@echo "Build Daily Package Successfully !"
	@echo "====================================================="

release: pre init
	npm run build
	cp -rf ${BUILD_TOP_DIR}/ps-vue-baogang/build ${RELEASE_DIR}
	#cp -rf ${BUILD_TOP_DIR}/node_modules ${BUILD_TOP_DIR}/bower_components ${RELEASE_DIR}
	@echo "====================================================="
	@echo "Build Relase Package Successfully !"
	@echo "====================================================="
    
help:
	@echo "====================================================="
	@echo "Usage: "
	@echo "make clean           Clean all build"
	@echo "make init            Init Build Environment"
	@echo "make daily           Build daily package without js compress"
	@echo "make release         Build release package"
	@echo "====================================================="
	
    
