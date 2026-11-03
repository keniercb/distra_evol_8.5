<?php

/**
 * Description of IntegracionNomencladoresModel
 *
 * @author kenier
 */
class IntegracionNomencladoresModel extends BaseModel
{
    const NATURALEZA_PPA = -2,
          NATURALEZA_COMBUSTIBLE = -3,
          NATURALEZA_MUNICION = -4,
          NATURALEZA_INMUEBLE = -7,
          NATURALEZA_OBJETODEOBRA = -8,
          NATURALEZA_ACTIVOS = -9,
          NATURALEZA_HERRAMIENTA = -5;
    
    public function __construct()
    {
        parent::__construct();
    }
}
