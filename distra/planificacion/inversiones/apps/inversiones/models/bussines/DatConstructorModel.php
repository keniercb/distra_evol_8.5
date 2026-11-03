<?php

class DatConstructorModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }
    
    public function getConstructoresByidetapainversion($param) {
        return DatConstructor::getConstructoresByidetapainversion($param);
    }
    
    public function getConstructores($param) {
        return DatConstructor::getConstructores($param);
    }
}
