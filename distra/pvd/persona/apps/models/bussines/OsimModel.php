<?php

/**
 * Class OsimModel
 * Implementa los metodos necesarios para el sistema Osim
 *
 * @author Javier Rodriguez Lopez
 */
class OsimModel extends ZendExt_Model
{

    public function OsimModel()
    {
        parent::ZendExt_Model();
    }

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

    public function getPersonsByMedioContacto($limit, $start, $arrUsers, $idtipomediocontacto, $filter)
    {
        $dir_host = $_SERVER['HTTP_HOST'];
        $http = isset($_SERVER['HTTPS']) ? 'https' : 'http';
        $url = "{$http}://{$dir_host}/pvd/persona/views/images/";
        $path = substr(__FILE__, 0, strrpos(__FILE__, DIRECTORY_SEPARATOR . 'apps' . DIRECTORY_SEPARATOR)) .
            DIRECTORY_SEPARATOR . 'web' . DIRECTORY_SEPARATOR . 'pvd' . DIRECTORY_SEPARATOR . 'persona' .
            DIRECTORY_SEPARATOR . 'views' . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR;
        $queryObj = Doctrine_Query::create()->select(
            "p.idpersona  ,doc.numero as numid, p.nombre as nombre, p.snombre as snombre , p.papel as papel,
                p.sapel as sapel, c.idcontacto, c.contacto as contacto, c.oficial as oficial,
                encode(f.foto,'base64') as imgbase64,
                tc.denominacion as tipocontacto, tc.fdesde as desde, tc.fhasta as hasta,
                med.idtipomediocontacto, med.denominacion as medio, med.fdesde as desde, med.fhasta as hasta"
        )->from('DatPersona p')->leftJoin('p.DatDocidentidad doc')->leftJoin('p.DatFoto f')->leftJoin('p.DatContacto c')
            ->leftJoin('c.NomTipocontacto tc')->leftJoin('c.NomTipomediocontacto med');
        if (!empty($idtipomediocontacto)) {
            $queryObj->where('c.idtipomediocontacto = ?', $idtipomediocontacto);
        }
        if (!empty($filter)) {
            $queryObj->andWhere(
                "(doc.numero ilike '%$filter%' OR p.nombre ilike '%$filter%' OR p.snombre ilike '%$filter%'
            OR p.papel ilike '%$filter%' OR p.sapel ilike '%$filter%')"
            );
        }
        if (count($arrUsers) > 0) {
            $arrayIdPersona = $this->integrator->seguridad->getArrayIdPersonaByUsersName($arrUsers);
            if (count($arrayIdPersona) > 0) {
                $queryObj->WhereIn('p.idpersona', $arrayIdPersona);
            } else {
                return array();
            }
        }
        if ($limit) {
            $queryObj->limit($limit);
        }
        if ($start) {
            $queryObj->offset($start);
        }
        $cantPersona = $queryObj->count();
        $persons = $queryObj->fetchArray();
        $result = array();
        foreach ($persons as $values) {
            $image = $values['imgbase64'];
            unset($values['imgbase64']);
            $result[] = $values;
            file_put_contents($path . $values['idpersona'] . '.png', base64_decode(base64_decode($image)));
            $result['foto'] = $url . $values['idpersona'] . '.png';
        }
        $result[] = $cantPersona;

        return $result;
    }

    public function getDatosAuxPersona($limit, $start, $arrUsers, $filter)
    {
        $dir_host = $_SERVER['HTTP_HOST'];
        $http = isset($_SERVER['HTTPS']) ? 'https' : 'http';
        $url = "{$http}://{$dir_host}/pvd/persona/views/images/";
        $path = substr(__FILE__, 0, strrpos(__FILE__, DIRECTORY_SEPARATOR . 'apps' . DIRECTORY_SEPARATOR)) .
            DIRECTORY_SEPARATOR . 'web' . DIRECTORY_SEPARATOR . 'pvd' . DIRECTORY_SEPARATOR . 'persona' .
            DIRECTORY_SEPARATOR . 'views' . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR;
        $arrayIdPersona = $this->integrator->seguridad->getArrayIdPersonaByUsersName($arrUsers);
        $persons = DatPersonaossim::getPrincipalesDatosPersona(
            $arrayIdPersona, $filter, $limit, $start, null, null
        );
        $cant = DatPersonaossim::getCantPrincipalesDatosPersona($arrayIdPersona, $filter, null, null);
        //return $personas;
        $arrIdPersons = array();
        foreach ($persons as $person) {
            $arrIdPersons[] = $person['idpersona'];
        }
        $users = $this->integrator->seguridad->getUsersInformationByArrayIdPersona($arrIdPersons);
        //  return $users;
        foreach ($persons as &$person) {
            /* file_put_contents($path . $person['idpersona'] . '.png', base64_decode(base64_decode($person['foto'])));
             $person['foto'] = $url . $person['idpersona'] . '.png';*/
            $arrcargo = $this->integrator->metadatos->DameEstructura($person['idcargo']);
            $person['cargo'] = $arrcargo[0]->denominacion;
            $arrentidad = $this->integrator->metadatos->DameEstructura($person['identidad']);
            $person['entidad'] = $arrentidad[0]->denominacion;
            if ($users) {
                foreach ($users as $user) {
                    if ($person['idpersona'] == $user['idpersona']) {
                        $person['nombreusuario'] = $user['nombreusuario'];
                        break;
                    }
                }
            }
            //$dpa = $person["DatDireccion"][0]["idprovincia"];
            $prov_muni = $this->getProvMuni();
            foreach ($person["DatDireccion"] as $k => $v) {
                $person['municipio'] = $this->findInDpa($v['idprovincia'], $prov_muni->prov);
                $person['provincia'] = $this->findInDpa($v['idmunicipio'], $prov_muni->muni);
                $person['direccion'] = $v['direccion'];
            }
        }

        return array('datos' => $persons, 'cant' => $cant);
        // return array('datos' => $persons, 'cant' =>
        // DatPersonaossim::getCantPrincipalesDatosPersona($arrayIdPersona, $filter, $limit, $start, null, null));
    }

    private function getProvMuni($idPais = null)
    {
        try {
            $res = new stdClass();
            $res->prov = ZendExt_IoC::getInstance()->datosmaestros->obtenerNivelEstructuralPorPais(
                empty($idPais) ? 1 : $idPais, 16
            );
            $res->muni = ZendExt_IoC::getInstance()->datosmaestros->obtenerNivelEstructuralPorPais(
                empty($idPais) ? 1 : $idPais, 14
            );

            return $res;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function findInDpa($id, array $array)
    {
        if (count($array) > 0) {
            foreach ($array as $k => $v) {
                if ($v['iddpt'] == $id) {
                    return $v['denominacion'];
                }
            }
        }

        return '';
    }
}