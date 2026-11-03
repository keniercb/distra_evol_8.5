<?php

/**
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class ClasificadorinvolModel extends ZendExt_Model
{
    /* var $estructurasInvol;

      function __construct() {
      $this->estructurasInvol = array();
      } */

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function mostrarInvolucradosGrupos($idelemento, $idtipoelemento)
    {
      $involucrados = array();
      $conta = 0;
      $obj = new DatInvolucrados();

      $result = $obj->involucradosDadoIdElemento($idelemento);

      if (isset($result)) {
        $involucrados = $this->obtenerInvolucrados(
          $result, $idelemento, $idtipoelemento
        );
      }

      $aux_involucrados=$involucrados;
      foreach ($aux_involucrados as $key => $value){
        if ($value['tipo'] == 0) {
          $cont = count($involucrados);
          $tipoinvol = 1;
          $arrayusuariosgrupo
            = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupoGU(
            $value['idgrupo']
          );
          if (isset($arrayusuariosgrupo[0])) {
            foreach ($arrayusuariosgrupo as $usuario) {
              $involucrados[$cont]['tipoinvol'] = $tipoinvol;
              if ($usuario['idestructura']) {
                $involucrados[$cont]['idinvolucrado']
                                                   = $usuario['idestructura'];
                $involucrados[$cont]['llaveinvolucrado']
                                                   = $usuario['idestructura'] . $tipoinvol;
                $involucrados[$cont]['idgrupo'] = null;
                $involucrados[$cont]['idusuario']
                                                   = $usuario['idestructura'];
                $involucrados[$cont]['tipo'] = 2;
                $estructura
                                                   = $this->integrator->metadatos->DameEstructura(
                  $usuario['idestructura']
                );
                $involucrados[$cont]['denominacion']
                                                   = $estructura[0]->denominacion;
                $involucrados[$cont]['nombretipo'] = 'Estructura';
                $cont++;
              } else {
                $involucrados[$cont]['idinvolucrado']
                                                   = $usuario['idusuario'];
                $involucrados[$cont]['llaveinvolucrado']
                                                   = $usuario['idusuario'] . $tipoinvol;
                $involucrados[$cont]['idgrupo'] = null;
                $involucrados[$cont]['idusuario']
                                                   = $usuario['idusuario'];
                $involucrados[$cont]['tipo'] = 1;
                $involucrados[$cont]['denominacion']
                                                   =
                $denominacion = $this->obtenerNombreApellidosDeUsuario(
                  $usuario['idusuario']
                );
                $involucrados[$cont]['nombretipo'] = 'Usuario';
                $cont++;
              }
            }
          }
        }
      }

      $respuesta=array();
      $pos=0;
      foreach ($involucrados as $value){
          if($value['tipo'] != 0){
            $respuesta[$pos++]=$value;
          }
      }

      return $respuesta;
    }

    public function MostrarInvolucrados($idelemento, $idtipoelemento)
    {
        $involucrados = array();
        $conta = 0;
        $obj = new DatInvolucrados();
        if ($idtipoelemento == 'grupo') {
            $cont = 0;
            $tipoinvol = 1;
            $arrayusuariosgrupo
                = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupoGU(
                $idelemento
            );
            if (isset($arrayusuariosgrupo[0])) {
                foreach ($arrayusuariosgrupo as $usuario) {
                    $involucrados[$cont]['tipoinvol'] = $tipoinvol;
                    if ($usuario['idestructura']) {
                        $involucrados[$cont]['idinvolucrado']
                            = $usuario['idestructura'];
                        $involucrados[$cont]['llaveinvolucrado']
                            = $usuario['idestructura'] . $tipoinvol;
                        $involucrados[$cont]['idgrupo'] = null;
                        $involucrados[$cont]['idusuario']
                            = $usuario['idestructura'];
                        $involucrados[$cont]['tipo'] = 2;
                        $estructura
                            = $this->integrator->metadatos->DameEstructura(
                            $usuario['idestructura']
                        );
                        $involucrados[$cont]['denominacion']
                            = $estructura[0]->denominacion;
                        $involucrados[$cont]['nombretipo'] = 'Estructura';
                        $cont++;
                    } else {
                        $involucrados[$cont]['idinvolucrado']
                            = $usuario['idusuario'];
                        $involucrados[$cont]['llaveinvolucrado']
                            = $usuario['idusuario'] . $tipoinvol;
                        $involucrados[$cont]['idgrupo'] = null;
                        $involucrados[$cont]['idusuario']
                            = $usuario['idusuario'];
                        $involucrados[$cont]['tipo'] = 1;
                        $involucrados[$cont]['denominacion']
                            =
                        $denominacion = $this->obtenerNombreApellidosDeUsuario(
                            $usuario['idusuario']
                        );
                        $involucrados[$cont]['nombretipo'] = 'Usuario';
                        $cont++;
                    }
                }
            }
        }
        else if ($idtipoelemento == 'calendario') {
            $cont = 0;
            $tipoinvol = 1;
            $arrayusuariosconfiguracion
                = $this->pIntegrator->configuracionpdo->getInvolucradoConfCalendario(
                $idelemento
            );
            foreach ($arrayusuariosconfiguracion as $involucrado) {
                if ($involucrado['idtipo'] == 2) {
                    $involucrados[$cont]['idinvolucrado']
                        = $involucrado['idinvolucrado'];
                    $involucrados[$cont]['llaveinvolucrado']
                        = $involucrado['idinvolucrado'] . $tipoinvol;
                    $involucrados[$cont]['idgrupo'] = null;
                    $involucrados[$cont]['idusuario']
                        = $involucrado['idinvolucrado'];
                    $involucrados[$cont]['tipo'] = $involucrado['idtipo'];
                    $estructura = $this->integrator->metadatos->DameEstructura(
                        $involucrado['idinvolucrado']
                    );
                    $involucrados[$cont]['denominacion']
                        = $estructura[0]->denominacion;
                    $involucrados[$cont]['nombretipo'] = 'Estructura';
                    $cont++;
                } else {
                    if ($involucrado['idtipo'] == 0) {
                        $grupo
                            = $this->pIntegrator->configuracionpdo->DameDatosDeGrupo(
                            $involucrado['idinvolucrado']
                        );
                        if (isset($grupo['idgrupo'])) {
                            $involucrados[$cont]['idinvolucrado']
                                = $involucrado['idinvolucrado'];
                            $involucrados[$cont]['llaveinvolucrado']
                                = $grupo['idgrupo'] . $tipoinvol;
                            $involucrados[$cont]['idgrupo'] = $grupo['idgrupo'];
                            $involucrados[$cont]['idusuario']
                                = $involucrado['idinvolucrado'];
                            $involucrados[$cont]['tipo']
                                = $involucrado['idtipo'];
                            $involucrados[$cont]['denominacion']
                                = $grupo['dengrupo'];
                            $involucrados[$cont]['nombretipo'] = 'Gupo';
                            $cont++;
                        } else {
                            $id = $involucrado['idinvolucrado'];
                            $eliminar = Doctrine::getTable('DatGrupoEstructura')
                                ->findByDql("idgrupo = $id");
                            if ($eliminar[0]->idgrupo != null) {
                                $eliminar[0]->delete();
                            }
                        }
                    } else {
                        $involucrados[$cont]['idinvolucrado']
                            = $involucrado['idinvolucrado'];
                        $involucrados[$cont]['llaveinvolucrado']
                            = $involucrado['idinvolucrado'] . $tipoinvol;
                        $involucrados[$cont]['idgrupo'] = null;
                        $involucrados[$cont]['idusuario']
                            = $involucrado['idinvolucrado'];
                        $involucrados[$cont]['tipo'] = $involucrado['idtipo'];
                        $involucrados[$cont]['denominacion']
                            =
                        $denominacion = $this->obtenerNombreApellidosDeUsuario(
                            $involucrado['idinvolucrado']
                        );
                        $involucrados[$cont]['nombretipo'] = 'Usuario';
                        $cont++;
                    }
                }
            }
        }

        else if ($idtipoelemento == 'comportamiento') {
            $cont = 0;
            $tipoinvol = 1;
            $arrayusuariosconfiguracion
                = $this->pIntegrator->configuracionpdo->getInvolucradoConfComportamiento(
                $idelemento
            );
            foreach ($arrayusuariosconfiguracion as $involucrado) {
                if ($involucrado['idtipo'] == 2) {
                    $involucrados[$cont]['idinvolucrado']
                        = $involucrado['idinvolucrado'];
                    $involucrados[$cont]['llaveinvolucrado']
                        = $involucrado['idinvolucrado'] . $tipoinvol;
                    $involucrados[$cont]['idgrupo'] = null;
                    $involucrados[$cont]['idusuario']
                        = $involucrado['idinvolucrado'];
                    $involucrados[$cont]['tipo'] = $involucrado['idtipo'];
                    $estructura = $this->integrator->metadatos->DameEstructura(
                        $involucrado['idinvolucrado']
                    );
                    $involucrados[$cont]['denominacion']
                        = $estructura[0]->denominacion;
                    $involucrados[$cont]['nombretipo'] = 'Estructura';
                    $involucrados[$cont]['idtipoinvolucrado']
                        = $involucrado['idtipoinvolucrado'];
                    $involucrados[$cont]['tipoinvolucrado']
                        = $involucrado['tipoinvolucrado'];

                    $cont++;
                } else {
                    if ($involucrado['idtipo'] == 0) {
                        $grupo
                            = $this->pIntegrator->configuracionpdo->DameDatosDeGrupo(
                            $involucrado['idinvolucrado']
                        );
                        if (isset($grupo['idgrupo'])) {
                            $involucrados[$cont]['idinvolucrado']
                                = $involucrado['idinvolucrado'];
                            $involucrados[$cont]['llaveinvolucrado']
                                = $grupo['idgrupo'] . $tipoinvol;
                            $involucrados[$cont]['idgrupo'] = $grupo['idgrupo'];
                            $involucrados[$cont]['idusuario']
                                = $involucrado['idinvolucrado'];
                            $involucrados[$cont]['tipo']
                                = $involucrado['idtipo'];
                            $involucrados[$cont]['denominacion']
                                = $grupo['dengrupo'];
                            $involucrados[$cont]['nombretipo'] = 'Gupo';
                            $involucrados[$cont]['idtipoinvolucrado']
                                = $involucrado['idtipoinvolucrado'];
                            $involucrados[$cont]['tipoinvolucrado']
                                = $involucrado['tipoinvolucrado'];
                            $cont++;
                        } else {
                            $id = $involucrado['idinvolucrado'];
                            $eliminar = Doctrine::getTable('DatGrupoEstructura')
                                ->findByDql("idgrupo = $id");
                            if ($eliminar[0]->idgrupo != null) {
                                $eliminar[0]->delete();
                            }
                        }
                    } else {
                        $involucrados[$cont]['idinvolucrado']
                            = $involucrado['idinvolucrado'];
                        $involucrados[$cont]['llaveinvolucrado']
                            = $involucrado['idinvolucrado'] . $tipoinvol;
                        $involucrados[$cont]['idgrupo'] = null;
                        $involucrados[$cont]['idusuario']
                            = $involucrado['idinvolucrado'];
                        $involucrados[$cont]['tipo'] = $involucrado['idtipo'];
                        $involucrados[$cont]['denominacion']
                            /* = $this->integrator->seguridad->nombreUsuario(
                              $involucrado['idinvolucrado']
                              ); */
                            =
                        $denominacion = $this->obtenerNombreApellidosDeUsuario(
                            $involucrado['idinvolucrado']
                        );
                        $involucrados[$cont]['nombretipo'] = 'Usuario';
                        $involucrados[$cont]['idtipoinvolucrado']
                            = $involucrado['idtipoinvolucrado'];
                        $involucrados[$cont]['tipoinvolucrado']
                            = $involucrado['tipoinvolucrado'];
                        $cont++;


                    }
                }
            }
        }
        else if ($idtipoelemento == 'incidencia') {
            $arregloincidegrupos = DatGrupoIncidencia::DameGrupoConIdIncidencia(
                $idelemento
            );
            foreach ($arregloincidegrupos as $resultad) {
                $ste = $resultad['idgrupo'];
                $idresa = $resultad[0];
                $involucrados[$conta]['denominacion'] = $idresa;
                $involucrados[$conta]['idgrupo'] = $resultad['idgrupo'];
                $involucrados[$conta]['idinvolucrado'] = $resultad['idgrupo'];
                $involucrados[$conta]['llaveinvolucrado'] = $ste . 1;
                $involucrados[$conta]['tipo'] = 0;
                $involucrados[$conta++]['nombretipo'] = 'Grupo';
            }
            $arregloincideuser
                = DatUsuarioIncidencia::DameUsuarioConIdIncidencia($idelemento);
            foreach ($arregloincideuser as $resultado) {
                $idres = $resultado[0];
                $involucrados[$conta]['denominacion']
                    =
                $denominacion = $this->obtenerNombreApellidosDeUsuario($idres);
                $involucrados[$conta]['tipo'] = 1;
                $involucrados[$conta]['idusuario'] = $idres;
                $involucrados[$conta]['idinvolucrado'] = $idres;
                $involucrados[$conta]['llaveinvolucrado'] = $idres . 1;
                $involucrados[$conta++]['nombretipo'] = 'Usuario';
            }
            $arregloincideestructura
                = DatEstructuraIncidencia::DameEstructuraConIdIncidencia(
                $idelemento
            );
            foreach ($arregloincideestructura as $resul) {
                $idrespe = $resul[0];
                $aun = $this->integrator->metadatos->DameEstructura($idrespe);
                $involucrados[$conta]['denominacion'] = $aun[0]->denominacion;
                $involucrados[$conta]['idusuario'] = $idrespe;
                $involucrados[$conta]['idinvolucrado'] = $idrespe;
                $involucrados[$conta]['llaveinvolucrado'] = $idrespe . 1;
                $involucrados[$conta]['tipo'] = 2;
                $involucrados[$conta++]['nombretipo'] = 'Estructura';
            }
        }
        else if ($idtipoelemento == 'desviacion') {
            $involucrados = $this->ObtenerPublicadosParaDesviacion($idelemento);
        }
        else{
          if ($idtipoelemento == 5) {
            $result = $obj->involucradosDadoIdArc($idelemento);
          } else {
            if ($idtipoelemento == 6) {
              $result = $obj->involucradosDadoIdCriterio($idelemento);
            } else {
              if ($idtipoelemento != 'grupo'
                && $idtipoelemento != 'nomenclador'
                && isset($idelemento)
              ) {
                $result = $obj->involucradosDadoIdElemento($idelemento);
              }
            }
          }

          if (isset($result)) {
            $involucrados = $this->obtenerInvolucrados(
              $result, $idelemento, $idtipoelemento
            );
          }
        }

      return $involucrados;
    }

    //Funcion para obtener los involucrados
    public function obtenerInvolucrados($result, $idelemento, $idtipoelemento)
    {

        $involucrados = array();
        if ($result == null && $idelemento != 'undefined'
            && !empty($idelemento)
        ) {
            $obj = new DatInvolucrados();
            $result = $obj->involucradosDadoIdElemento($idelemento);
        }
        if (isset($result)) {
            $indexinvol = false;
            foreach ($result as $key => $k) {
                $involucrados[$key]['tipoinvol'] = 1;
                $involucrados[$key]['idinvolucrado'] = $k['idinvolucrado'];
                $involucrados[$key]['llaveinvolucrado']
                    = $k['llaveinvolucrado'];
                $involucrados[$key]['idgrupo'] = $k['idgrupo'];
                $involucrados[$key]['idusuario'] = $k['idusuario'];
                $involucrados[$key]['tipoinvolucrado'] = $k['dennomenclador'];
                $involucrados[$key]['incidencia'] = $k['porcientocumplimiento'];
                $involucrados[$key]['idtipoinvolucrado'] = $k['idnomenclador'];
                if ($k['tipoinvolucrado'] == 0) {
                    $grupo
                        = $this->pIntegrator->configuracionpdo->DameDatosDeGrupo(
                        $k['idgrupo']
                    );
                    $denominacion = $grupo['dengrupo'];
                    $nombretipo = 'Grupo';
                    $involucrados[$key]['tipo'] = 0;
                    $involucrados[$key]['denominacion'] = $denominacion;
                    $involucrados[$key]['nombretipo'] = $nombretipo;
                } else {
                    if ($k['tipoinvolucrado'] == 1) {
                        $idusuario = $k['idusuario'];
                        $denominacion = $this->obtenerNombreApellidosDeUsuario(
                            $idusuario
                        );
                        if ($denominacion == null) {
                            $invol = new stdClass();
                            $invol->idinvolucrado
                                = $involucrados[$key]['idinvolucrado'];
                            $invol->llaveinvolucrado
                                = $involucrados[$key]['llaveinvolucrado'];
                            $invol->idusuario
                                = $involucrados[$key]['idusuario'];
                            $invol->tipo = 'usuarioeliminado';
                            $invol->tipoinvol = 'usuarioeliminado';
                            $this->EliminarInvolucrados(
                                $invol, $idelemento, $idtipoelemento
                            );
                            unset($involucrados[$key]);
                            $indexinvol = true;
                        } else {
                            $comparar = $this->compararInvolucradosListados(
                                $idusuario, $result
                            );
                            if ($comparar) {
                                unset($involucrados[$key]);
                                $indexinvol = true;
                            } else {
                                $nombretipo = 'Usuario';
                                $involucrados[$key]['tipo'] = 1;
                                $involucrados[$key]['denominacion']
                                    = $denominacion;
                                $involucrados[$key]['nombretipo'] = $nombretipo;
                            }
                        }
                    } else {
                        if ($k['tipoinvolucrado'] == 2) {
                            $datosestructura
                                = $this->integrator->metadatos->DameEstructura(
                                $k['idusuario']
                            );
                            $denominacion = $datosestructura[0]->denominacion;
                            $nombretipo = 'Estructura';
                            $involucrados[$key]['tipo'] = 2;
                            $involucrados[$key]['denominacion'] = $denominacion;
                            $involucrados[$key]['nombretipo'] = $nombretipo;
                        }
                    }
                }
            }
        }
        if ($indexinvol) {
            $involucrados = array_values($involucrados);
        }

        return $involucrados;
    }

    public function compararInvolucradosListados($idusuario, $involucrados)
    {
        $comparar = false;
        $usuarioestruc
            = $this->pIntegrator->configuracionpdo->getEstructuraUsuario(
            $idusuario
        );
        if (isset($usuarioestruc)) {
            foreach ($involucrados as $value) {
                if ($value['idestructura']
                    == $usuarioestruc['sql'][0]['idestructura']
                ) {
                    $comparar = true;
                    break;
                }
            }
        }
        return $comparar;
    }

    public function obtenerNombreApellidosDeUsuario($idusuario)
    {
        $denominacion = $this->integrator->seguridad->nombreUsuario($idusuario);
        if ($denominacion != null) {
            $arrayidpersona
                = $this->integrator->seguridad->getIdPersonaByIdUsuario(
                $idusuario
            );
            $idpersona = $arrayidpersona[0]['idpersona'];
            if ($idpersona != null) {
                /*$datospersona
                    = $this->integrator->pvd->getPrincipalesDatosPersona(
                    $params[] = $idpersona
                );
                if ($datospersona->data[0] != '') {
                    $denominacion = ($datospersona->data[0]['nombreapellidos']);
                }*/
            }
        }
        return $denominacion;
    }

    public function ObtenerPublicadosParaDesviacion($idelemento)
    {
        $involucrados = array();
        $usuariosInvolucrados = array();
        $gruposInvolucrados = array();
        $estructurasInvolucradas = array();

        $datUserDesviacion = Doctrine::getTable('DatUsuarioDesviacion')
            ->findByDql("iddesviacion = '$idelemento'");
        if (count($datUserDesviacion) > 0) {
            for ($i = 0; $i < count($datUserDesviacion); $i++) {
                $usuariosInvolucrados[$i]['tipoinvol'] = 1;
                $usuariosInvolucrados[$i]['idinvolucrado']
                    = $datUserDesviacion[$i]->idusuario;
                $usuariosInvolucrados[$i]['llaveinvolucrado']
                    = $datUserDesviacion[$i]->idusuario . 1;
                $usuariosInvolucrados[$i]['idgrupo'] = null;
                $usuariosInvolucrados[$i]['denominacion']
                    = $this->integrator->seguridad->nombreUsuario(
                    $datUserDesviacion[$i]->idusuario
                );
                $usuariosInvolucrados[$i]['idusuario']
                    = $datUserDesviacion[$i]->idusuario;
                $usuariosInvolucrados[$i]['nombretipo'] = 'Usuario';
                $usuariosInvolucrados[$i]['tipo'] = 1;
            }
        }
        $datGrupoDesviacion = Doctrine::getTable('DatGrupoDesviacion')
            ->findByDql("iddesviacion = '$idelemento'");
        if (count($datGrupoDesviacion) > 0) {
            for ($i = 0; $i < count($datGrupoDesviacion); $i++) {
                $gruposInvolucrados[$i]['idinvolucrado']
                    = $datGrupoDesviacion[$i]->idgrupo;
                $gruposInvolucrados[$i]['llaveinvolucrado']
                    = $datGrupoDesviacion[$i]->idgrupo . 1;
                $gruposInvolucrados[$i]['idgrupo']
                    = $datGrupoDesviacion[$i]->idgrupo;
                $gruposInvolucrados[$i]['idusuario']
                    = $datGrupoDesviacion[$i]->idgrupo;
                $gruposInvolucrados[$i]['tipo'] = 0;
                $grupo = $this->pIntegrator->configuracionpdo->DameDatosDeGrupo(
                    $datGrupoDesviacion[$i]->idgrupo
                );
                $gruposInvolucrados[$i]['denominacion'] = $grupo['dengrupo'];
                $gruposInvolucrados[$i]['nombretipo'] = 'Gupo';
            }
        }
        $datEstructDesviacion = Doctrine::getTable('DatEstructuraDesviacion')
            ->findByDql("iddesviacion = '$idelemento'");
        if (count($datEstructDesviacion) > 0) {
            for ($i = 0; $i < count($datEstructDesviacion); $i++) {
                $estructurasInvolucradas[$i]['idinvolucrado']
                    = $datEstructDesviacion[$i]->idestructura;
                $estructurasInvolucradas[$i]['llaveinvolucrado']
                    = $datEstructDesviacion[$i]->idestructura . 1;
                $estructurasInvolucradas[$i]['idgrupo'] = null;
                $estructurasInvolucradas[$i]['idusuario']
                    = $datEstructDesviacion[$i]->idestructura;
                $estructurasInvolucradas[$i]['tipo'] = 2;
                $estructura = $this->integrator->metadatos->DameEstructura(
                    $datEstructDesviacion[$i]->idestructura
                );
                $estructurasInvolucradas[$i]['denominacion']
                    = $estructura[0]->denominacion;
                $estructurasInvolucradas[$i]['nombretipo'] = 'Estructura';
            }
        }
        $involucrados = array_merge($usuariosInvolucrados, $gruposInvolucrados);
        $involucrados = array_merge($involucrados, $estructurasInvolucradas);

        return $involucrados;
    }

    public function ObtenerPublicadosParaCargarArbolInvol(
        $idelemento, $usersdomain
    ) {
        $datGrupoDesviacion = Doctrine::getTable('DatGrupoDesviacion')
            ->findByDql("iddesviacion = '$idelemento'");
        if (count($datGrupoDesviacion) > 0) {
            for ($i = 0; $i < count($datGrupoDesviacion); $i++) {
                for ($j = 0; $j < count($usersdomain); $j++) {
                    if ($datGrupoDesviacion[$i]->idgrupo
                        == $usersdomain[$j]['idgrupo']
                    ) {
                        $usersdomain[$j]['checked'] == true;
                    }
                }
            }
        }
        $datUserDesviacion = Doctrine::getTable('DatUsuarioDesviacion')
            ->findByDql("iddesviacion = '$idelemento'");
        if (count($datUserDesviacion) > 0) {
            for ($i = 0; $i < count($datUserDesviacion); $i++) {
                for ($j = 0; $j < count($usersdomain); $j++) {
                    if ($datUserDesviacion[$i]->idusuario
                        == $usersdomain[$j]['idusuario']
                    ) {
                        $usersdomain[$j]['checked'] == true;
                    }
                }
            }
        }
        $datEstructDesviacion = Doctrine::getTable('DatEstructuraDesviacion')
            ->findByDql("iddesviacion = '$idelemento'");
        if (count($datEstructDesviacion) > 0) {

            for ($i = 0; $i < count($datEstructDesviacion); $i++) {
                for ($j = 0; $j < count($usersdomain); $j++) {
                    if ($datEstructDesviacion[$i]->idestructura
                        == $usersdomain[$j]['idestructura']
                    ) {
                        $usersdomain[$j]['checked'] == true;
                    }
                }
            }
        }
        return $usersdomain;
    }

    public function ObtenerIncidenciaPublicadaGrupo($idelemento, $usersdomain)
    {
        foreach ($usersdomain as $key => $grupo) {
            $cont = DatGrupoIncidencia::publicos($idelemento, $grupo['id']);
            if ($cont[0][0] == $idelemento) {
                $usersdomain[$key]['checked'] = true;
            }
        }
        return $usersdomain;
    }

    public function ObtenerIncidenciaPublicadaEstructura(
        $idelemento, $usersdomain
    ) {
        foreach ($usersdomain as $key => $grupo) {
            $cont = DatEstructuraIncidencia::publicos(
                $idelemento, $grupo['idestructura']
            );
            if ($cont[0][0] == $idelemento) {
                $usersdomain[$key]['checked'] = true;
            }
        }
        return $usersdomain;
    }

    public function ObtenerIncidenciaPublicadaUsuario($idelemento, $usersdomain)
    {
        foreach ($usersdomain as $key => $grupo) {
            $cont = DatUsuarioIncidencia::publicos(
                $idelemento, $grupo['idusuario']
            );
            if ($cont[0][0] == $idelemento) {
                $usersdomain[$key]['checked'] = true;
            }
        }
        return $usersdomain;
    }

    public function Involucrar(
        $involucrado, $idelemento, $idtipoelemento, $estamodificando,
        $userestruc
        /* ,$arraytipoinvol */
    )
    {
        $tipoinvolucrado = $involucrado->tipo;
        $idnivelinvolucrado = $involucrado->tipoinvol;
        $idtipoinvol = $involucrado->idtipoinvolucrado;
        $porciento = $involucrado->incidencia;

        if ($tipoinvolucrado == 0) {
            $idgrupo = $involucrado->idgrupo;
            $idusuario = null;
            $llaveinvolucrado = $idgrupo . $idnivelinvolucrado;
        } else {
            if ($tipoinvolucrado == 1) {
                $idgrupo = null;
                $idusuario = $involucrado->idusuario;
                $llaveinvolucrado = $idusuario . $idnivelinvolucrado;
            } else {
                if ($tipoinvolucrado == 2) {
                    $idgrupo = null;
                    $idusuario = $involucrado->idusuario;
                    if (!$involucrado->idusuario) {
                        $idusuario = $involucrado->idestructura;
                    }
                    $llaveinvolucrado = $idusuario . 1;
                }
            }
        }

        $existeinvolucrado = Doctrine::getTable('DatInvolucrados')->findByDql(
            "llaveinvolucrado = $llaveinvolucrado"
        )->toArray();

        if (!isset($existeinvolucrado[0]['llaveinvolucrado'])) {
            $newobjinvol = new DatInvolucrados();
            $newobjinvol->llaveinvolucrado = $llaveinvolucrado;
            $newobjinvol->idgrupo = $idgrupo;
            $newobjinvol->idusuario = ($tipoinvolucrado == 2) ? null
                : $idusuario;
            $newobjinvol->idestructura = ($tipoinvolucrado == 1 && $userestruc)
                ? $involucrado->idestructura : $idusuario;
            $newobjinvol->idusuario = $idusuario;
            $newobjinvol->tipoinvolucrado = $tipoinvolucrado;
            $newobjinvol->idnivelinvolucrado = $idnivelinvolucrado;
            $newobjinvol->save();
            $idinvolucrado = $newobjinvol->idinvolucrado;
        } else {
            $idinvolucrado = $existeinvolucrado[0]['idinvolucrado'];
        }
        if ($idtipoelemento == 5) {
            $existeinvolucradoarc = Doctrine::getTable('DatArcDatInvolucrados')
                ->findByDql(
                    "llaveinvolucrado = $llaveinvolucrado AND idarc = $idelemento "
                );
            if (!isset($existeinvolucradoarc[0])) {
                $newobjinvolarc = new DatArcDatInvolucrados();
                $newobjinvolarc->idarc = $idelemento;
                $newobjinvolarc->idinvolucrado = $idinvolucrado;
                $newobjinvolarc->llaveinvolucrado = $llaveinvolucrado;
                $newobjinvolarc->save();
            }
        } else {
            if ($idtipoelemento == 6) {
                $existeinvolucradocriterio = Doctrine::getTable(
                    'DatCriterioDatInvolucrados'
                )->findByDql(
                    "llaveinvolucrado = $llaveinvolucrado AND idcriteriomedida = $idelemento "
                );
                if (!isset($existeinvolucradocriterio[0])) {
                    $newobjinvolel = new DatCriterioDatInvolucrados();
                    $newobjinvolel->idcriteriomedida = $idelemento;
                    $newobjinvolel->idinvolucrado = $idinvolucrado;
                    $newobjinvolel->llaveinvolucrado = $llaveinvolucrado;
                    $newobjinvolel->save();
                }
            } else {
                $existeinvolucradoelemento = Doctrine::getTable(
                    'DatElementosDatInvolucrados'
                )->findByDql(
                    "llaveinvolucrado = $llaveinvolucrado AND idelemento = $idelemento "
                );

                if (!isset($existeinvolucradoelemento[0])) {
                    $newobjinvolel = new DatElementosDatInvolucrados();
                    $newobjinvolel->idelemento = $idelemento;
                    $newobjinvolel->idinvolucrado = $idinvolucrado;
                    $newobjinvolel->llaveinvolucrado = $llaveinvolucrado;
                    $newobjinvolel->idtipoinvolucrado = $idtipoinvol;
                    $newobjinvolel->porcientocumplimiento = $porciento;
                    $newobjinvolel->save();
                    //actualizo los involucrados de las repeticiones periodicas 
                    if ($estamodificando == 1 && $idtipoelemento == 3) {
                        //obtengo todas las repticiones
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $idelemento
                        );
                        $arrayestadosverdoc
                            = $this->pIntegrator->workflow->EstadosVerDoc(
                            $idsubsistema = 15, $objelemento->idusuariocrea,
                            $idtipodoc = 3
                        );
                        $arrayestados = array();
                        if (isset($arrayestadosverdoc['data'][0])) {
                            foreach (
                                $arrayestadosverdoc['data'] as $key => $estado
                            ) {
                                $arrayestados[]['idestado']
                                    = $estado['idestado'];
                            }
                        }
                        $arrayrepeticiones = DatElementos::ObtenerRepeticiones(
                            $idelemento, $arrayestados
                        );
                        if (isset($arrayrepeticiones[0])) {
                            foreach ($arrayrepeticiones as $key => $repeticion)
                            {
                                $objelementorep = Doctrine::getTable(
                                    'DatElementos'
                                )->find($repeticion['idelemento']);
                                if (isset($objelementorep->idelemento)) {
                                    if ($repeticion['tiporepeticion'] == 1) {
                                        $this->Involucrar(
                                            $involucrado,
                                            $repeticion['idelemento'],
                                            $idtipoelemento, $estamodificando
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public function EliminarInvolucrados(
        $involucrado, $idelemento, $idtipoelemento
    ) {

        $eliminvolusuarioestruc = false;
        $tipoinvolucrado = $involucrado->tipo;
        $idnivelinvolucrado = $involucrado->tipoinvol;

        if ($tipoinvolucrado == 0) {
            $idgrupo = $involucrado->idgrupo;
            $idusuario = null;
            $llaveinvolucrado = $idgrupo . $idnivelinvolucrado;
        } else {
            if ($tipoinvolucrado == 1) {
                $idgrupo = null;
                $idusuario = $involucrado->idusuario;
                $llaveinvolucrado = $idusuario . $idnivelinvolucrado;
            } else {
                if ($tipoinvolucrado == 2) {
                    $idgrupo = null;
                    $idusuario = $involucrado->idusuario;
                    if (!$involucrado->idusuario) {
                        $idusuario = $involucrado->idestructura;
                    }
                    $llaveinvolucrado = $idusuario . 1;

                    $usuarioestruc
                        = $this->pIntegrator->configuracionpdo->getUsuarioEstructura(
                        $idusuario
                    );
                    if (isset($usuarioestruc)) {
                        $llaveinvolusuarioestruc
                            = $usuarioestruc['sql'][0]['idusuario'] . 1;
                        $eliminvolusuarioestruc = true;
                    }
                }
            }
        }
        if ($idtipoelemento == 5) {
            $existeinvolucradoarc = Doctrine::getTable('DatArcDatInvolucrados')
                ->findByDql(
                    "idarc = $idelemento AND llaveinvolucrado = $llaveinvolucrado"
                );
            if (isset($existeinvolucradoarc[0])) {
                $existeinvolucradoarc->delete();
            }
        } else {
            if ($idtipoelemento == 6) {
                $existeinvolucradocriterio = Doctrine::getTable(
                    'DatCriterioDatInvolucrados'
                )->findByDql(
                    "llaveinvolucrado = $llaveinvolucrado AND idcriteriomedida = $idelemento "
                );
                if (isset($existeinvolucradocriterio[0])) {
                    $existeinvolucradocriterio->delete();
                }
            } else {
                //eliminado usuarios que no existen
                if ($tipoinvolucrado == 'usuarioeliminado') {
                    $llaveinvolucrado = $involucrado->llaveinvolucrado;
                    $existeinvolucradoelemento = Doctrine::getTable(
                        'DatElementosDatInvolucrados'
                    )->findByDql(
                        "idelemento = $idelemento AND llaveinvolucrado = $llaveinvolucrado"
                    );
                    $existeinvolucrado = Doctrine::getTable(
                        'DatInvolucrados'
                    )->findByDql("idinvolucrado = $involucrado->idinvolucrado");

                    if (isset($existeinvolucradoelemento[0])) {
                        $existeinvolucradoelemento->delete();
                    }
                    if (isset($existeinvolucrado[0])) {
                        $existeinvolucrado->delete();
                    }
                } else {
                    $existeinvolucradoelemento = Doctrine::getTable(
                        'DatElementosDatInvolucrados'
                    )->findByDql(
                        "idelemento = $idelemento AND llaveinvolucrado = $llaveinvolucrado"
                    );
                    //eliminando el usuario asignado a la estructura
                    if ($eliminvolusuarioestruc) {
                        $existeinvolusuarioestruc = Doctrine::getTable(
                            'DatElementosDatInvolucrados'
                        )->findByDql(
                            "idelemento = $idelemento AND llaveinvolucrado = $llaveinvolusuarioestruc"
                        );
                        if (isset($existeinvolusuarioestruc[0])) {
                            $existeinvolusuarioestruc->delete();
                        }
                    }
                    if (isset($existeinvolucradoelemento[0])) {
                        $existeinvolucradoelemento->delete();
                        //actualizo los involucrados de las repeticiones periodicas 
                        if ($idtipoelemento == 3) {
                            if ($tipoinvolucrado == 1) {
                                //obtengo las reasignaciones generadas por este involucrado y las elimino(valorar)
                                $arrayreasignaciones
                                    = DatElementosDatElementos::ObtenerReasignacionesDadoIdAutor(
                                    $idelemento, $idusuario
                                );
                                if (isset($arrayreasignaciones[0])) {
                                    $objcmpacmodel
                                        = new CmpgestionaractividadesModel();
                                    foreach (
                                        $arrayreasignaciones as $reasignacion
                                    ) {
                                        $arrayidactividades[]
                                            = $reasignacion['idelementohijo'];
                                    }
                                    $objcmpacmodel->EliminarActividades(
                                        $arrayidactividades, $idusuario
                                    );
                                }
                            }
                            if ($tipoinvolucrado == 0) {
                                $usuariosdelgrupo
                                    = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                                    $idgrupo
                                );
                                if (isset($usuariosdelgrupo[0])) {
                                    foreach (
                                        $usuariosdelgrupo as $key => $usuario
                                    ) {
                                        $arrayreasignaciones
                                            = DatElementosDatElementos::ObtenerReasignacionesDadoIdAutor(
                                            $idelemento, $usuario['idusuario']
                                        );
                                        if (isset($arrayreasignaciones[0])) {
                                            $objcmpacmodel
                                                = new CmpgestionaractividadesModel(
                                            );
                                            foreach (
                                                $arrayreasignaciones as
                                                $reasignacion
                                            ) {
                                                $arrayidactividades[]
                                                    = $reasignacion['idelementohijo'];
                                            }
                                            $objcmpacmodel->EliminarActividades(
                                                $arrayidactividades, $idusuario
                                            );
                                            $arrayidactividades = array();
                                        }
                                    }
                                }
                            }
                            //obtengo todas las repticiones
                            $objelemento = Doctrine::getTable('DatElementos')
                                ->find(
                                    $idelemento
                                );
                            $arrayestadosverdoc
                                = $this->pIntegrator->workflow->EstadosVerDoc(
                                $idsubsistema = 15, $objelemento->idusuariocrea,
                                $idtipodoc = 3
                            );
                            $arrayestados = array();
                            if (isset($arrayestadosverdoc['data'][0])) {
                                foreach (
                                    $arrayestadosverdoc['data'] as $key =>
                                    $estado
                                ) {
                                    $arrayestados[]['idestado']
                                        = $estado['idestado'];
                                }
                            }
                            $arrayrepeticiones
                                = DatElementos::ObtenerRepeticiones(
                                $idelemento, $arrayestados
                            );
                            if (isset($arrayrepeticiones[0])) {
                                foreach (
                                    $arrayrepeticiones as $key => $repeticion
                                ) {
                                    $objelementorep = Doctrine::getTable(
                                        'DatElementos'
                                    )->find($repeticion['idelemento']);
                                    if (isset($objelementorep->idelemento)) {
                                        if ($repeticion['tiporepeticion']
                                            == 1
                                        ) {
                                            $this->EliminarInvolucrados(
                                                $involucrado,
                                                $repeticion['idelemento'],
                                                $idtipoelemento
                                            );
                                        }
                                    }
                                }
                            }
                        }
                        if ($idtipoelemento == 1) {
                            //eliminando usuario de criterios de medida
                            $criteriosPorObj = Doctrine::getTable(
                                'DatCriteriomedida'
                            )->findByDql("idobjetivo = $idelemento ");

                            if (isset($criteriosPorObj)) {
                                foreach ($criteriosPorObj as $criterio) {
                                    $existe = Doctrine::getTable(
                                        'DatCriterioDatInvolucrados'
                                    )->findByDql(
                                        "llaveinvolucrado = $llaveinvolucrado
                                    AND idcriteriomedida = $criterio->idcriteriomedida "
                                    );
                                    if (isset($existe[0])) {
                                        $existe->delete();
                                    }
                                }
                            }
                            if ($tipoinvolucrado == 1) {
                                //obtengo las reasignaciones generadas por este 
                                //involucrado y las elimino(valorar)
                                $arrayreasignaciones
                                    = DatElementosDatElementos::ObtenerReasignacionesDadoIdAutor(
                                    $idelemento, $idusuario
                                );
                                if (isset($arrayreasignaciones[0])) {
                                    $objcmpobjmodel
                                        = new CmpgestionarobjetivosModel();
                                    foreach (
                                        $arrayreasignaciones as $reasignacion
                                    ) {
                                        $arrayidobjetivos[]
                                            = $reasignacion['idelementohijo'];
                                    }
                                    $objcmpobjmodel->EliminarObjetivos(
                                        $arrayidobjetivos, null
                                    );
                                }
                            }
                            if ($tipoinvolucrado == 0) {
                                $usuariosdelgrupo
                                    = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                                    $idgrupo
                                );
                                if (isset($usuariosdelgrupo[0])) {
                                    foreach (
                                        $usuariosdelgrupo as $key => $usuario
                                    ) {
                                        $arrayreasignaciones
                                            = DatElementosDatElementos::ObtenerReasignacionesDadoIdAutor(
                                            $idelemento, $usuario['idusuario']
                                        );
                                        if (isset($arrayreasignaciones[0])) {
                                            $objcmpobjmodel
                                                = new CmpgestionarobjetivosModel(
                                            );
                                            foreach (
                                                $arrayreasignaciones as
                                                $reasignacion
                                            ) {
                                                $arrayidobjetivos[]
                                                    = $reasignacion['idelementohijo'];
                                            }
                                            $objcmpobjmodel->EliminarObjetivos(
                                                $arrayidobjetivos, null
                                            );
                                            $arrayidobjetivos = array();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public function Reasignar(
        $idelemento, $tipoelemento, $arrayinvolucrados, $idestadoaprob,
        $idusuariosession
    ) {
        $existeelemento = Doctrine::getTable('DatElementos')->find($idelemento);
        if (!isset($existeelemento->idelemento)) {
            $respuesta = 0;
        } else {
            $parametros->eshija = 0;
            $parametros->idusuariocrea = $idusuariosession;
            $parametros->gradocumplimiento = $existeelemento->gradocumplimiento;
            $parametros->denelemento = $existeelemento->denelemento;
            $parametros->descelemento = $existeelemento->descelemento;
            $parametros->idtipoelemento = $tipoelemento;
            $parametros->dirigentes = $existeelemento->dirigente;
            $parametros->participantes = $existeelemento->participante;
            $parametros->idestadoaprob = $idestadoaprob;
            $parametros->arrayinvolucrados = $arrayinvolucrados;
            if ($tipoelemento == 1) {
                $objobjetivo = Doctrine::getTable('DatObjetivo')->find(
                    $idelemento
                );
                $parametros->fechainicio = $objobjetivo->fechainicio;
                $parametros->fechafin = $objobjetivo->fechafin;
                //obtengo el array de relaciones con elementos de planificacion
                $objrelacionesmodel = new CmprelacionesModel();
                $arrayrelaciones
                    = $objrelacionesmodel->CargarRelacionesSuperiores(
                    $tipoelemento, $idelemento, $idusuariosession
                );
                $relaciones = array();
                if ($arrayrelaciones['contador'] > 0) {
                    foreach ($arrayrelaciones['array'] as $key => $relacion) {
                        $relaciones[$key]->idplan = $relacion['idplan'];
                        $relaciones[$key]->idarc = $relacion['idarc'];
                        $relaciones[$key]->idobjetivo = $relacion['idobjetivo'];
                        $relaciones[$key]->idfip = $relacion['idfip'];
                        $relaciones[$key]->tipoelemento
                            = $relacion['tipoelemento'];
                        $relaciones[$key]->idautorrelacion
                            = $relacion['idautorrelacion'];
                    }
                }
                $parametros->arrayelementosrelacionados = $relaciones;
                $parametros->retornar = 1;
                $objobjetivomodel = new CmpgestionarobjetivosModel();
                $objobjetivoo = $objobjetivomodel->AdicionarObjetivo(
                    $parametros
                );
                //obtengo los criterios de medidas donde esta involucrado el usuario en session 
                $cero = 0;
                $uno = 1;
                $arrayinvolcriterio[]['llaveinvolucrado']
                    = $idusuariosession . $cero;
                $arrayinvolcriterio[]['llaveinvolucrado']
                    = $idusuariosession . $uno;
                $arraygrupos
                    = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                    $idusuariosession
                );
                if (isset($arraygrupos[0])) {
                    foreach ($arraygrupos as $grupo) {
                        $arrayinvolcriterio[]['llaveinvolucrado']
                            = $grupo['idgrupo'] . $cero;
                        $arrayinvolcriterio[]['llaveinvolucrado']
                            = $grupo['idgrupo'] . $uno;
                    }
                }
                $arraycriterios
                    = DatCriteriomedida::ObtenerCriteriosporInvolucrados(
                    $idelemento, $arrayinvolcriterio
                );
                if (isset($arraycriterios[0])) {
                    foreach ($arraycriterios as $key => $criterio) {
                        $parametroscriterio->idusuariocrea
                            = $idusuariosession; //ver esto como es realmente
                        $parametroscriterio->dencriterio
                            = $criterio['dencriterio'];
                        $parametroscriterio->descriterio
                            = $criterio['descriterio'];
                        $parametroscriterio->fechainicio
                            = $criterio['fechainicio'];
                        $parametroscriterio->fechafin = $criterio['fechafin'];
                        $parametroscriterio->participantes
                            = $criterio['participante'];
                        $parametroscriterio->arrayinvolucrados
                            = $arrayinvolucrados;
                        $parametroscriterio->idobjetivo
                            = $objobjetivoo->idobjetivo;
                        $parametroscriterio->valormeta = $criterio['valormeta'];
                        $parametroscriterio->valorreal = $criterio['valoreal'];
                        $parametroscriterio->idumedida = $criterio['idumedida'];
                        $resp = $objobjetivomodel->AdicionarCriterio(
                            $parametroscriterio
                        );
                    }
                }


                $objelemeelem = new DatElementosDatElementos();
                $objelemeelem->idelementopadre = $idelemento;
                $objelemeelem->idelementohijo = $objobjetivoo->idobjetivo;
                $objelemeelem->origen = 5;
                $objelemeelem->idautor = $idusuariosession;
                $objelemeelem->save();
                $observacionesexistentes
                    = DatObservacionesPdo::GetObsDadoIdElemen($idelemento);
                if (isset($observacionesexistentes[0])) {
                    $objobservmodel = new CmpgestionarobservacionesModel();
                    foreach ($observacionesexistentes as $observacion) {
                        $resp = $objobservmodel->AdicionarObservaciones(
                            $observacion['asunto'], $observacion['cuerpo'],
                            $objobjetivoo->idobjetivo,
                            $observacion['idusuariocrea']
                        );
                    }
                }
            } else {
                $objactividad = Doctrine::getTable('DatActividades')->find(
                    $idelemento
                );
                $parametros->fechainicio = $objactividad->fechainicio;
                $parametros->fechafin = $objactividad->fechafin;
                $parametros->horainicio = $objactividad->horainicio;
                $parametros->horafin = $objactividad->horafin;
                $parametros->lugar = $objactividad->lugar;
                $parametros->esprincipal = $objactividad->esprincipal;
                //obtengo las repeticiones de la actividad donde el 
                //usuario en session esta involucrado
                $objcmpactmodel = new CmpgestionaractividadesModel();
                $arrayrepeticiones
                    = $objcmpactmodel->ObtenerRepeticionesActividad(
                    $idelemento, $idusuariosession
                );


                $repeticiones = array();
                if (isset($arrayrepeticiones[0])) {
                    foreach ($arrayrepeticiones as $key => $repeticion) {
                        $repeticiones[$key]->fechainicio
                            = $repeticion['fechainicio'];
                        $repeticiones[$key]->fechafin = $repeticion['fechafin'];
                        $repeticiones[$key]->lugar = $repeticion['lugar'];
                        $repeticiones[$key]->horainicio = $repeticion['hora'];
                        $repeticiones[$key]->horafin = $repeticion['horafin'];
                        $repeticiones[$key]->tiporepeticion = 1;
                    }
                }
                $parametros->arrayrepeticiones = $repeticiones;
                //obtengo el array de relaciones con nomencladores de actividad
                $idcattegactividad = null;
                $idtipoactividad = null;
                $arrayrelacionesnomeclador
                    = DatElementos::ObtenerActNomenclador($idelemento);
                if (isset($arrayrelacionesnomeclador[0])) {
                    if ($arrayrelacionesnomeclador[0]['tiponomenclador'] == 2) {
                        $idcattegactividad
                            = $arrayrelacionesnomeclador[0]['idnomenclador'];
                        $idtipoactividad
                            = $arrayrelacionesnomeclador[1]['idnomenclador'];
                    } else {
                        $idtipoactividad
                            = $arrayrelacionesnomeclador[0]['idnomenclador'];
                        $idcattegactividad
                            = $arrayrelacionesnomeclador[1]['idnomenclador'];
                    }
                }
                $parametros->idcategoria = $idcattegactividad;
                $parametros->idtipo = $idtipoactividad;
                //obtengo el array de relaciones con elementos de planificacion
                $objrelacionesmodel = new CmprelacionesModel();
                $arrayrelaciones
                    = $objrelacionesmodel->CargarRelacionesSuperiores(
                    $tipoelemento, $idelemento, $idusuariosession
                );
                $relaciones = array();
                if ($arrayrelaciones['contador'] > 0) {
                    foreach ($arrayrelaciones['array'] as $key => $relacion) {
                        $relaciones[$key]->idplan = $relacion['idplan'];
                        $relaciones[$key]->idarc = $relacion['idarc'];
                        $relaciones[$key]->idobjetivo = $relacion['idobjetivo'];
                        $relaciones[$key]->idfip = $relacion['idfip'];
                        $relaciones[$key]->iddesviacion
                            = $relacion['iddesviacion'];
                        $relaciones[$key]->tipoelemento
                            = $relacion['tipoelemento'];
                        $relaciones[$key]->idautorrelacion
                            = $relacion['idautorrelacion'];
                    }
                }
                $parametros->arrayelementosrelacionados = $relaciones;
                $parametros->retornar = 1;
                $objcmpactmodel = new CmpgestionaractividadesModel();
                $objact = $objcmpactmodel->AdicionarActividad($parametros);
                $objelemeelem = new DatElementosDatElementos();
                $objelemeelem->idelementopadre = $idelemento;
                $objelemeelem->idelementohijo = $objact->idactividad;
                $objelemeelem->origen = 5;
                $objelemeelem->idautor = $idusuariosession;
                $objelemeelem->save();
                $observacionesexistentes
                    = DatObservacionesPdo::GetObsDadoIdElemen($idelemento);
                if (isset($observacionesexistentes[0])) {
                    $objobservmodel = new CmpgestionarobservacionesModel();
                    foreach ($observacionesexistentes as $observacion) {
                        $resp = $objobservmodel->AdicionarObservaciones(
                            $observacion['asunto'], $observacion['cuerpo'],
                            $objact->idactividad, $observacion['idusuariocrea']
                        );
                    }
                }
            }
            $respuesta = 1;
        }
        return $respuesta;
    }

    public function ObtenerClasificadorCriterio(
        $idobjetivo, $idcriterio, $estamodificando, $nodo
    ) {
        if (empty($idobjetivo)) {
            $idobjetivo = Doctrine::getTable('DatCriteriomedida')->find(
                $idcriterio
            );
        }
        $objobjetivo = Doctrine::getTable('DatElementos')->find($idobjetivo);
        if (isset($objobjetivo->idelemento)) {
            if ($nodo == 'nodo1') {
                $obj = new DatInvolucrados();
                $arrayinvolobjetivo = $obj->involucradosDadoIdElemento(
                    $idobjetivo
                );
                if (isset($arrayinvolobjetivo[0])) {
                    foreach ($arrayinvolobjetivo as $key => $invol) {

                        $text = $this->integrator->seguridad->nombreUsuario(
                            $invol['idusuario']
                        );
                        $iconCls = 'usuarioejecutor';
                        $leaf = true;
                        if ($invol['tipoinvolucrado'] == 0) {
                            $grupo
                                = $this->pIntegrator->configuracionpdo->DameDatosDeGrupo(
                                $invol['idgrupo']
                            );
                            $text = $grupo['dengrupo'];
                            $iconCls = 'grupoejecutor';
                            $tieneusuarios
                                = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                                $invol['idgrupo']
                            );
                            if (isset($tieneusuarios[0])) {
                                $leaf = false;
                            }
                        }
                        $checked = false;
                        if ($estamodificando) {
                            $existerelacion
                                = DatCriterioDatInvolucrados::Buscar(
                                $idcriterio, $invol['idinvolucrado']
                            );

                            if (isset($existerelacion[0])) {
                                $checked = true;
                            }
                        }
                        $arrayinvolucrados[$key]['text'] = $text;
                        $arrayinvolucrados[$key]['idgrupo'] = $invol['idgrupo'];
                        $arrayinvolucrados[$key]['idusuario']
                            = $invol['idusuario'];
                        $arrayinvolucrados[$key]['tipo']
                            = $invol['tipoinvolucrado'];
                        $arrayinvolucrados[$key]['tipoinvol'] = 1;
                        $arrayinvolucrados[$key]['draggable'] = false;
                        $arrayinvolucrados[$key]['iconCls'] = $iconCls;
                        $arrayinvolucrados[$key]['checked'] = $checked;
                        $arrayinvolucrados[$key]['leaf'] = $leaf;
                    }
                }
            } else {
                $tieneusuarios
                    = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                    $nodo
                );
                if (isset($tieneusuarios[0])) {
                    foreach ($tieneusuarios as $key => $usuario) {
                        $arrayinvolucrados[$key]['text']
                            = $this->integrator->seguridad->nombreUsuario(
                            $usuario['idusuario']
                        );
                        $arrayinvolucrados[$key]['idgrupo'] = null;
                        $arrayinvolucrados[$key]['idusuario']
                            = $usuario['idusuario'];
                        $arrayinvolucrados[$key]['tipo'] = 1;
                        $arrayinvolucrados[$key]['tipoinvol'] = 1;
                        $arrayinvolucrados[$key]['draggable'] = false;
                        $arrayinvolucrados[$key]['iconCls'] = 'usuarioejecutor';
                        $arrayinvolucrados[$key]['leaf'] = true;
                    }
                }
            }
        }
        return $arrayinvolucrados;
    }

    public function BuscarInvolucradosCriterio(
        $denominacion, $estamodificando, $idobjetivo, $idcriterio
    ) {
        $objobjetivo = Doctrine::getTable('DatElementos')->find($idobjetivo);
        if (isset($objobjetivo->idelemento)) {
            $obj = new DatInvolucrados();
            $arrayinvolobjetivo = $obj->involucradosDadoIdElemento($idobjetivo);
            if (isset($arrayinvolobjetivo[0])) {
                $cont = 0;
                foreach ($arrayinvolobjetivo as $key => $invol) {
                    $text = $this->integrator->seguridad->nombreUsuario(
                        $invol['idusuario']
                    );
                    $iconCls = 'usuarioejecutor';
                    $leaf = true;
                    if ($invol['tipoinvolucrado'] == 0) {
                        $grupo
                            = $this->pIntegrator->configuracionpdo->DameDatosDeGrupo(
                            $invol['idgrupo']
                        );
                        $text = $grupo['dengrupo'];
                        $iconCls = 'grupoejecutor';
                        $tieneusuarios
                            = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                            $invol['idgrupo']
                        );
                        if (isset($tieneusuarios[0])) {
                            $leaf = false;
                        }
                    }
                    if (eregi($denominacion, $text)) {
                        $checked = false;
                        if ($estamodificando) {
                            $existerelacion
                                = DatCriterioDatInvolucrados::Buscar(
                                $idcriterio, $invol['idinvolucrado']
                            );
                            if (isset($existerelacion[0])) {
                                $checked = true;
                            }
                        }
                        $arrayinvolucrados[$cont]['text'] = $text;
                        $arrayinvolucrados[$cont]['idgrupo']
                            = $invol['idgrupo'];
                        $arrayinvolucrados[$cont]['idusuario']
                            = $invol['idusuario'];
                        $arrayinvolucrados[$cont]['tipo']
                            = $invol['tipoinvolucrado'];
                        $arrayinvolucrados[$cont]['tipoinvol'] = 1;
                        $arrayinvolucrados[$cont]['draggable'] = false;
                        $arrayinvolucrados[$cont]['iconCls'] = $iconCls;
                        $arrayinvolucrados[$cont]['checked'] = $checked;
                        $arrayinvolucrados[$cont]['leaf'] = $leaf;
                        $cont++;
                    }
                }
            }
        }
        return $arrayinvolucrados;
    }

}
