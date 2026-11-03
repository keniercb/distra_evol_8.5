<?php
class AppPlanif extends ZendExt_App {
	public $componentName;

	public function AppPlanif($cmpName) {
		$this->componentName = $cmpName;
	}
	protected function initFrontController() {
		//print_r(ZendExt_IoC::getInstance());die;
		ZendExt_IoC::getInstance()->{$this->componentName}->initComponent();
		parent::initFrontController();
	}
}