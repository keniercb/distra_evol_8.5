<?php
class AppPlanif extends ZendExt_App {
	private $componentName;	
	function AppPlanif($cmpName) {
		$this->componentName = $cmpName;
	}
	function initFrontController() {
		ZendExt_IoC::getInstance()->{$this->componentName}->initComponent();
		parent::initFrontController();
	}
}