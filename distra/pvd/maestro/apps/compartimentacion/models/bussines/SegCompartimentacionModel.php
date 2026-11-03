<?php 
class SegCompartimentacionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getCompartimentaciones($start, $limit)
    {
        return SegCompartimentacion::getCompartimentacionesAll($start, $limit);
    }
}
