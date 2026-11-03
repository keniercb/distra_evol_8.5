<?php
class MagentoConfigModel extends BaseModel{
    private $configLoader;
    public function __construct(){
        parent::__construct();
        $this->configLoader = JSONConfigLoader::__init();
        $this->configLoader->load('config');
    }

    public function getConfig($key)
    {
        // return $this->configLoader->$key;
    }
}