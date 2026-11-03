<?php

/**
 *
 */
class SubmayorService extends ZendExt_Model
{

    private $_mSubmayor;

    /**
     *
     */
    public function __construct()
    {
        $this->_mSubmayor = new SubmayorModel();
    }

    public function GetConteoRegNumericosEntidad($idestructuraop, $parametros)
    {
        return $this->_mSubmayor->GetConteoRegNumericosEntidad($idestructuraop, $parametros, false);
    }

}
