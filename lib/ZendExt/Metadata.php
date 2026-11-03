<?php

class ZendExt_Metadata {
    protected static $_instance;
    protected  $_concept;
    protected  $_attribute;
    protected  $_relation;
    protected  $_metadata;

    static public function getInstance() {
        if (!isset($_instance)) {
            $_instance = new self();
        }
        return $_instance;
    }

    public function Concept() {
        if (!isset($this->_concept)) {
            $this->_concept = new ZendExt_Metadata_Models_TablaModel();
        }
        return $this->_concept;
    }

    public function Attribute() {
        if (!isset($this->_attribute)) {
            $this->_attribute = new ZendExt_Metadata_Models_CampoModel();
        }
        return $this->_attribute;
    }

    public function Relation() {
        if (!isset($this->_relation)) {
            $this->_relation = new ZendExt_Metadata_Models_RelacionModel();
        }
        return $this->_relation;
    }

    public function Metadata() {
        if (!isset($this->_metadata)) {
            $this->_metadata = new ZendExt_Metadata_Models_MetadataModel();
        }
        return $this->_metadata;
    }
}


