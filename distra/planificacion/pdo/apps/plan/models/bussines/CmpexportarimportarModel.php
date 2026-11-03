<?php

/**
 * @author    Mairelys Fernandez
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpexportarimportarModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function ExportarDatosExcel(
        // $idusuario, $arrayidelementos, $tipoelemento
    )
    {

    }

    public function ExportarDatosDoc(
        //  $idusuario, $arrayidelementos, $tipoelemento
    )
    {

    }

    /**
     * Nombre de la función DevolverElementosDeUnTipoDeterminado
     * Descripcion  Funcion que se encarga de devolver los elementos
     * de un tipo determinado que fueron insertados.
     *
     * @author * Ariadna Rendón Artola
     *
     * @param $tipoelemento - el tipo de los elementos que se deben retornar.
     * @param $iddominio    - dominio.
     * @param $idusuario    - usuario.
     * @param $certificado  - certificado
     *
     * @return array - elementos de un tipo determinado que fueron
     * insertados y que se desean mostrar.
     */
    public function DevolverElementosDeUnTipoDeterminado(
        $tipoelemento, $arrayidelem, $iddominio, $idusuario, $certificado
    ) {
        if ($tipoelemento == 0) {
            return $this->DevolverPlanImport(
                $arrayidelem, $idusuario, $certificado, $iddominio
            );
        }
        if ($tipoelemento == 1) {
            return $this->DevolverObjImport($arrayidelem, $idusuario);
        }
        if ($tipoelemento == 2) {
            return $this->DevolverFIPImport(
                $arrayidelem, $idusuario, $certificado, $iddominio
            );
        }
        if ($tipoelemento == 3) {
            return $this->DevolverActivImport($arrayidelem, $idusuario);
        }
        if ($tipoelemento == 5) {
            return $this->DevolverARCImport($arrayidelem, $idusuario);
        }
    }

    /**
     * Nombre de la función DevolverActivImport
     * Descripcion  Devuelve un conjunto de actividades dado un arreglo
     * de idactividades.
     *
     * @author * Ariadna Rendón Artola
     *
     * @param Array   $arrayidacts - arreglo de idactividades.
     * @param Integer $idusuario   - identificador de usuario en sección.
     *
     * @return array
     */
    public function DevolverActivImport($arrayidacts, $idusuario)
    {
        $objdatelementos = new DatElementos();
        $arrayactividades = $objdatelementos->GetActividades($arrayidacts);

        if (isset($arrayactividades['resultado'])) {
            foreach ($arrayactividades['resultado'] as $key => $actividad) {
                $parent = null;
                $obj = new DatElementosDatElementos();
                $existepadre = $obj->BuscarElementoPadreOrigen(
                    $actividad['idelemento']
                );
                if (isset($existepadre [0])) {
                    $parent = $existepadre [0]['idelementopadre'];
                }
                $leaf = true;
                $tienehijos = $objdatelementos->CargarActividades(
                    $actividad['idelemento'], $idusuario, '', '', "", "",
                    array(), array(), '', '', '', '', 10, '', '', array(), 0,
                    array()
                );
                if ($tienehijos['total'] > 0) {
                    $leaf = false;
                }
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                if ($actividad['idautor'] != $idusuario) {
                    $superior = 1;
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $idusuario, $actividad['idautor']
                    );
                    if ($permisomodificacion) {

                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                        $subordinado = $permisomodificacion[4];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                        $subordinado = 0;
                    }
                }
                if ($actividad['idestadoaprob'] != null) {
                    $arrayestadosaprob
                        = $this->pIntegrator->workflow->DenomEstado(
                        $actividad['idestadoaprob']
                    );
                }
                $nombreestadoapro = '';
                if (isset($arrayestadosaprob[0])) {
                    $nombreestadoapro = $arrayestadosaprob[0]->denominacion;
                }
                $arrayactividades['resultado'][$key]['nombreautor']
                    = $this->integrator->seguridad->nombreUsuario(
                    $actividad['idautor']
                );
                $arrayactividades['resultado'][$key]['_is_leaf'] = $leaf;
                $arrayactividades['resultado'][$key]['_parent'] = $parent;
                $arrayactividades['resultado'][$key]['superior'] = $superior;
                $arrayactividades['resultado'][$key]['subordinado']
                    = $subordinado;
                $arrayactividades['resultado'][$key]['modificar'] = $modificar;
                $arrayactividades['resultado'][$key]['eliminar'] = $eliminar;
                $arrayactividades['resultado'][$key]['estadocumplimiento']
                    = $actividad['estadocumplimiento'] . "("
                    . $actividad['gradocumplimiento'] . "%)";
                $arrayactividades['resultado'][$key]['nombreestadoaprob']
                    = $nombreestadoapro;
                $arrayactividades['resultado'][$key]['observaciones']
                    = $actividad['observaciones'];
            }//fin del foreach
        }//fin de condicional
        return $arrayactividades;
    }

//fin de la funsión DevolverActivImport
    /**
     * Nombre de la función DevolverPlanImport
     * Descripcion  Devuelve un conjunto de planes dado un arreglo de idplanes.
     *
     * @author * Ariadna Rendón Artola
     *
     * @param Array   $arrayidelem - arreglo de idplanes.
     * @param Integer $idusuario   - identificador de usuario en sección.
     * @param Integer $iddominio   - identificador del dominio activo.
     * @param String  $certificado - Certificado.
     *
     * @return array
     */
    public function DevolverPlanImport(
        $arrayidelem, $idusuario, $certificado, $iddominio
    ) {
        $arrayplanes = DatPlanPdo::getPlanesImport($arrayidelem);
        if (isset($arrayplanes['resultado'])) {
            foreach ($arrayplanes['resultado'] as $key => $plan) {
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                $entrada = 1;
                if ($plan['idusuariocrea'] != $idusuario) {
                    $superior = 1;
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $idusuario, $plan['idusuariocrea'], $certificado,
                        $iddominio
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                        $subordinado = $permisomodificacion[4];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                        $subordinado = 0;
                    }
                }
                if ($plan['idestadoaprob'] != null) {
                    $arrayestadosaprob
                        = $this->pIntegrator->workflow->DenomEstado(
                        $plan['idestadoaprob']
                    );
                }
                $nombreestadoapro = '';
                if (isset($arrayestadosaprob[0])) {
                    $nombreestadoapro = $arrayestadosaprob[0]->denominacion;
                }
                $arrayplanes['resultado'][$key]['nombreautor']
                    = $this->integrator->seguridad->nombreUsuario(
                    $plan['idusuariocrea']
                );
                $arrayplanes['resultado'][$key]['estadocumplimiento']
                    = $plan['estadocumplimiento'] . "("
                    . $plan['gradocumplimiento'] . "%)";
                $arrayplanes['resultado'][$key]['nombreestadoaprob']
                    = $nombreestadoapro;
                $arrayplanes['resultado'][$key]['_is_leaf'] = true;
                $arrayplanes['resultado'][$key]['_parent'] = null;
                $arrayplanes['resultado'][$key]['superior'] = $superior;
                $arrayplanes['resultado'][$key]['subordinado'] = $subordinado;
                $arrayplanes['resultado'][$key]['modificar'] = $modificar;
                $arrayplanes['resultado'][$key]['eliminar'] = $eliminar;
            }//fin del foreach
        }//fin de la condicional                
        return $arrayplanes;
    }

//fin de la función DevolverPlanImport
    /**
     * Nombre de la función DevolverObjImport
     * Descripcion  Devuelve un conjunto de objetivos dado un arreglo de idobjetivos.
     *
     * @author * Ariadna Rendón Artola
     *
     * @param Array   $arrayidelem - arreglo de objetivos.
     * @param Integer $idusuario   - identificador de usuario en sección.
     *
     * @return array
     */
    public function DevolverObjImport($arrayidelem, $idusuario)
    {
        $objdatelementos = new DatElementos();
        $arrayobjetivos = $objdatelementos->GetObjetivos($arrayidelem);
        if (isset($arrayobjetivos['resultado'])) {
            foreach ($arrayobjetivos['resultado'] as $key => $objetivo) {
                $parent = null;
                $obj = new DatElementosDatElementos();
                $existepadre = $obj->BuscarElementoPadreOrigen(
                    $objetivo['idelemento']
                );
                if (isset($existepadre [0])) {
                    $parent = $existepadre [0]['idelementopadre'];
                }
                $leaf = true;
                $tienehijos = $objdatelementos->CargarObjetivos(
                    $objetivo['idelemento'], $idusuario, '', '', '', '', '', '',
                    '', $start, 10, '', '', array(), 0, array()
                );
                if ($tienehijos['total'] > 0) {
                    $leaf = false;
                }
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                if ($objetivo['idautor'] != $idusuario) {
                    $superior = 1;
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $idusuario, $objetivo['idautor']
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                        $subordinado = $permisomodificacion[4];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                        $subordinado = 0;
                    }
                }
                if ($objetivo['idestadoaprob'] != null) {
                    $arrayestadosaprob
                        = $this->pIntegrator->workflow->DenomEstado(
                        $objetivo['idestadoaprob']
                    );
                }
                $nombreestadoapro = '';
                if (isset($arrayestadosaprob[0])) {
                    $nombreestadoapro = $arrayestadosaprob[0]->denominacion;
                }
                $tienecriterios = 0;
                $idobj = $objetivo['idelemento'];
                $arraycriterios = Doctrine::getTable('DatCriteriomedida')
                    ->findByDql("idobjetivo = $idobj");
                if (isset($arraycriterios[0]->idcriteriomedida)
                    && $arraycriterios[0]->idcriteriomedida != ""
                ) {
                    $tienecriterios = 1;
                }
                $arrayobjetivos['resultado'][$key]['nombreautor']
                    = $this->integrator->seguridad->nombreUsuario(
                    $objetivo['idautor']
                );
                $arrayobjetivos['resultado'][$key]['_is_leaf'] = $leaf;
                $arrayobjetivos['resultado'][$key]['_parent'] = $parent;
                $arrayobjetivos['resultado'][$key]['superior'] = $superior;
                $arrayobjetivos['resultado'][$key]['subordinado']
                    = $subordinado;
                $arrayobjetivos['resultado'][$key]['modificar'] = $modificar;
                $arrayobjetivos['resultado'][$key]['eliminar'] = $eliminar;
                $arrayobjetivos['resultado'][$key]['estadocumplimiento']
                    = $objetivo['estadocumplimiento'] . "("
                    . $objetivo['gradocumplimiento'] . "%)";
                $arrayobjetivos['resultado'][$key]['nombreestadoaprob']
                    = $nombreestadoapro;
                $arrayobjetivos['resultado'][$key]['observaciones']
                    = $objetivo['observaciones'];
                $arrayobjetivos['resultado'][$key]['criterios']
                    = $tienecriterios;
            }
        }
        return $arrayobjetivos;
    }

//fin de lafuncion DevolverObjImport

    /**
     * Nombre de la función DevolverFIPImport
     * Descripcion  Devuelve un conjunto de FIPS dado un arreglo de idFIP.
     *
     * @author * Ariadna Rendón Artola
     *
     * @param Array   $arrayidelem - arreglo de idFIP.
     * @param Integer $idusuario   - identificador de usuario en sección.
     *
     * @return array
     */
    public function DevolverFIPImport(
        $arrayidelem, $idusuario, $certificado, $iddominio
    ) {
        $objdatelementos = new DatElementos();
        $arrayfips = $objdatelementos->GetarrayFIPS($arrayidelem);
        if (isset($arrayfips['resultado'])) {
            foreach ($arrayfips['resultado'] as $key => $fip) {
                $parent = null;
                $obj = new DatElementosDatElementos();
                $existepadre = $obj->BuscarElementoPadreOrigen(
                    $fip['idelemento']
                );
                if (isset($existepadre [0])) {
                    $parent = $existepadre [0]['idelementopadre'];
                }
                $leaf = true;
                $tienehijos = $objdatelementos->CargarFips(
                    $fip['idelemento'], $idusuario, $iddominio, $certificado,
                    '', '', '', '', array(), array(), '', '', '', '', 10, 0
                );
                if ($tienehijos['total'] > 0) {
                    $leaf = false;
                }
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                if ($fip['idautor'] != $idusuario) {
                    $superior = 1;
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $idusuario, $fip['idautor']
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                        $subordinado = $permisomodificacion[4];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                        $subordinado = 0;
                    }
                }
                $arrayfips['resultado'][$key]['nombreautor']
                    = $this->integrator->seguridad->nombreUsuario(
                    $fip['idautor']
                );
                $arrayfips['resultado'][$key]['_is_leaf'] = $leaf;
                $arrayfips['resultado'][$key]['_parent'] = $parent;
                $arrayfips['resultado'][$key]['superior'] = $superior;
                $arrayfips['resultado'][$key]['subordinado'] = $subordinado;
                $arrayfips['resultado'][$key]['modificar'] = $modificar;
                $arrayfips['resultado'][$key]['eliminar'] = $eliminar;
                $arrayfips['resultado'][$key]['estadocumplimiento']
                    = $fip['estadocumplimiento'] . "("
                    . $fip['gradocumplimiento']
                    . "%)";
                $arrayfips['resultado'][$key]['observaciones']
                    = $fip['observaciones'];
            }
        }
        return $arrayfips;
    }

//fin de la funcion DevolverFIPImport.

    /**
     * Nombre de la función DevolverARCImport
     * Descripcion  Devuelve un conjunto de ARC dado un arreglo de idARC.
     *
     * @author * Ariadna Rendón Artola
     *
     * @param Array   $arrayidelem - arreglo de idARC.
     * @param Integer $idusuario   - identificador de usuario en sección.
     *
     * @return array
     */
    public function DevolverARCImport($arrayidARC, $idusuario)
    {
        $objcmparcmodel = new CmpgestionararcModel();
        return $objcmparcmodel->CargarAreasImportadas($arrayidARC, $idusuario);
    }

//fin de la función DevolverARCImport
}
