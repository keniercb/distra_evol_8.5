<?php

abstract class BaseRecord extends Doctrine_Record
{

    protected $_fields;

    public function __set($attrib, $value)
    {
        parent:: __set($attrib, $value);
        $this->_fields[$attrib] = $value;
    }

    public function getInfo()
    {
        $query = Doctrine:: getTable(get_class($this))->createQuery();
        foreach ($this->_fields as $attrib => $value) {
            $whereFirstPart [] = ' ' . $attrib . '= ? ';
            $whereSecondPart[] = $value;
        }
        $query = $query->where(
            implode('AND', $whereFirstPart), $whereSecondPart
        );

        return $query->fetchArray();
    }

    public function existe()
    {
        return count($this->getInfo()) > 0;
    }

    public function getByParam($param = 'id', $value = null)
    {
        return Doctrine::getTable(get_class($this))->findBy(
            $param, $value ? $value : $this->$param, Doctrine::HYDRATE_ARRAY
        );
    }

}