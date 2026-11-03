<?php
class AppPlanif extends ZendExt_App {
	public $componentName;

	public function AppPlanif($cmpName) {
		foreach($cmpName as $cmp)
		$this->componentName[] = $cmp;
	}
	protected function initFrontController() {
		//print_r($this->componentName);die;
		foreach($this->componentName as $cmp)
		ZendExt_IoC::getInstance()->{$cmp}->initComponent();
		parent::initFrontController();
	}
}