<?php

class DatDatosnacimientoModel extends ZendExt_Model implements IConceptoExport
{
    protected $objBirthdata;

    protected $objConfigGeneralService;

    function __construct()
    {
        $this->objBirthdata = new DatDatosnacimiento();
        $this->objConfigGeneralService = new ConfiguracionGeneralService();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener los datos de nacimiento de la persona
     *
     * @param array $idpersona
     * @param       $filtro
     * @param       $limit
     * @param       $start
     *
     * @return array
     * @throws Exception
     */
    public function getBirthdataByIdPerson($idpersona, $filtro, $limit, $start)
    {
        try {
            //$objdirection = new DatDireccionModel();
            $data = $this->objBirthdata->getBirthdataByIdPerson($this->reflectArray($idpersona), $filtro, $limit, $start);
            //$prov_muni = $objdirection->getProvMuni();
            foreach ($data as $key => $value) {
                //print_r($this->objConfigGeneralService->getElementoid(320));die;
                //Obtengo la denominacion de la provincia y el municipio
                //$denomprov = $objdirection->findInDpa($value['idprovincia'], $prov_muni->prov);
                $denomprov = ZendExt_IoC::getInstance()->datosmaestros->getElementoid($value['idprovincia']);
                //$denommunic = $objdirection->findInDpa($value['idmunicipio'], $prov_muni->muni);
                $denommunic = ZendExt_IoC::getInstance()->datosmaestros->getElementoid($value['idmunicipio']);
                if ($denomprov[0]['denominacion'] == null || $denommunic[0]['denominacion'] == null) {
                    $data[$key]['denomprovmuni'] = '-';
                } else {
                    $data[$key]['denomprovmuni'] = $denomprov[0]['denominacion'] . '-' . $denommunic[0]['denominacion'];
                }
                //Obtengo la denominacion de la localidad
                //$localidad = $this->objConfigGeneralService->getChilds($value['idmunicipio']);
                //$data[$key]['denomlocalidad'] = $objdirection->findInDpa($value['idlocalidad'], $localidad);
                //$data[$key]['iddpt'] = $value['idlocalidad'];
                $pais = $this->objConfigGeneralService->findContryById($value['idpais']);
                $data[$key]['denompais'] = $pais['nombrepais'];

            }

            $response->data = $data;
            $response->quantity = ($limit > 0)
                ? $this->objBirthdata->getCantBirthdataByIdPerson($this->reflectArray($idpersona))
                : count($response->data);
            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $data
     *
     * @return array
     */
    public function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    /**
     * Funcion para adicionar los datos de nacimiento a la persona
     *
     * @param array $datos
     * @param       $idpersona
     *
     * @return mixed
     * @throws Exception
     */
    public function addBirthdata(array $datos, $idpersona)
    {
        try {
            if (isset($idpersona)) {
                if (count($datos) > 0) {
                    $collection = new Doctrine_Collection(Doctrine_Core::getTable('DatDatosnacimiento'));
                    foreach ($datos as $k => $v) {
                        $collection[0]->$k = $v;
                    }
                    $collection[0]->idpersona = $idpersona;
                    $collection->save();

                    return $collection->getFirst()->iddatosnacimiento;
                }
            } else {
                throw new  Exception('No existe la persona a la cual asignar los datos de nacimineto', 3);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para modificar los datos de nacimiento de la persona
     *
     * @param array $datos
     * @param       $idpersona
     *
     * @throws Exception
     */
    public function modBirthdata(array $datos, $idpersona)
    {
        try {
            if (isset($idpersona)) {
                if (count($datos) > 0) {
                    $collection = $this->objBirthdata->getById($datos['iddatosnacimiento']);
                    if ($collection) {
                        foreach ($datos as $k => $v) {
                            $collection->$k = $v;
                        }
                        $collection->idpersona = $idpersona;
                        $collection->save();
                    } else {
                        throw new  Exception('No existe datos de nacimineto para la persona', 3);
                    }
                }
            } else {
                throw new  Exception('No existe la persona a la cual asignar los datos de nacimiento', 3);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para obtenr la localidad dado el id muncipio de la persona
     *
     * @param $idmunicipio
     *
     * @return mixed
     * @throws Exception
     */
    public function getLocalityByIdMunic($idmunicipio)
    {
        try {
            $tmp = $this->objConfigGeneralService->getChilds($idmunicipio);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para obtener los paises
     *
     * @return mixed
     * @throws Exception
     */
    public function getContrys()
    {
        try {
            $temp = $this->objConfigGeneralService->getCountrys();

            return $temp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('ddnac.*')->leftJoin($baseAlias . '.DatDatosnacimiento ddnac');
    }

  
}

