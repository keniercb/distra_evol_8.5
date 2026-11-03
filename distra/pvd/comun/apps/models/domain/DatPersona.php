<?php

class DatPersona extends BaseDatPersona
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomSexo', array('local' => 'idsexo', 'foreing' => 'idsexo'));
        $this->hasOne('NomCategoriaPersona', array('local' => 'idcategoriapersona', 'foreing' => 'idcategoriapersona'));
        $this->hasOne('DatPersonadocidentidad', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany("DatFoto", array('local' => 'idpersona', 'foreign' => 'idpersona'));
        //$this->hasOne('DatPersodatosidentificacion', array('local'=>'idpersona','foreign'=>'idpersona'));
        $this->hasOne('DatOcupacionActual', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('DatPersonaingresofar', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        //$this->hasOne('DatPersonanumeroidentidad', array('local'=>'idpersona','foreign'=>'idpersona'));
        $this->hasOne('DatPersonanacimiento', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('DatPersonadatossociales', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('DatPersonaciudadania', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('DatPersonaestratificacionsocial', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('DatPersonafamiliares', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('DatPersonafamiliares', array('local' => 'idpersona', 'foreign' => 'idfamiliar'));
        $this->hasOne('DatPersonaestadosalud', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('DatPersonaafeccion', array('local' => 'idpersona', 'foreign' => 'idpersona'));

        $this->hasOne('DatPersonaingresorecibe', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('DatPersonaresidencia', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('DatPersonaestanciaexterior', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('DatPersonaafiliacionesactuales', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('HisHistoricoafiliacionesactuales', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('NomSituacionpersona', array('local' => 'idsituacionpersona', 'foreign' => 'idsituacionpersona'));
        $this->hasMany('NomSituacionespecificapersona', array('local' => 'idsituacionespecificapersona', 'foreign' => 'idsituacionespecificapersona'));
        $this->hasOne('DatPersonafamiliaresexterior', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('DatPersonarelacionespersonalesexterior', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    public function GetLLave()
    {
        try {
            $query = new Doctrine_Query ();
            $result = $query->select('MAX(idpersona)')->from('DatPersona')->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function Buscar($idpersona)
    {
        try {
            if (is_array($idpersona)) {
                $query = Doctrine_Query::create();
                $result = $query->from('DatPersona')
                    ->whereIn('idpersona', $idpersona)
                    ->execute();
            } else {
                $result = Doctrine::getTable('DatPersona')->find($idpersona);
            }
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetTodos()
    {
        try {
            $query = new Doctrine_Query ();
            $result = $query->select('dp.idpersona, dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, ns.idsexo, ns.denom as sexo, ntdid.idtipodocidentidad, ntdid.denom as docidentidad, ncp.idcategoriapersona, ncp.denom as categoriapersona')
                ->from('DatPersona dp')
                ->innerJoin('dp.NomSexo ns')
                ->innerJoin('dp.NomTipoDocIdentidad ntdid')
                ->innerJoin('dp.NomCategoriaPersona ncp')
                ->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function BuscarPersonaPorParamAntex($params, $limite, $inicio, $idestructura, $iddominio, $permiso, $meta, $fonetica = '')
    {
        $filtro = '';
        $filtro1 = '';
        $mfnt = new fnt();
        if ($params->numid != "") {
            $filtro .= " dp.numid ilike '%" . $params->numid . "%' and ";
            $filtro1 .= " dp1.numid ilike '%" . $params->numid . "%' and ";
        }
        if ($params->nombre != "") {
            if ($fonetica != '') {
                $fonetica = $mfnt->Conversion($params->nombre);
                $filtro .= " chf.fnom = '" . $fonetica . "' and ";
                $filtro1 .= " chf1.fnom = '" . $fonetica . "' and ";
            } else {
                $filtro .= "dp.nombre ilike '%" . $params->nombre . "%' and ";
                $filtro1 .= "dp1.nombre ilike '%" . $params->nombre . "%' and ";
            }
        }
        if ($params->snombre != "") {
            if ($fonetica != '') {
                $fonetica = $mfnt->Conversion($params->snombre);
                $filtro .= " chf.fsnom = '" . $fonetica . "' and ";
                $filtro1 .= " chf1.fsnom = '" . $fonetica . "' and ";
            } else {
                $filtro .= " dp.snombre ilike '%" . $params->snombre . "%' and ";
                $filtro1 .= " dp1.snombre ilike '%" . $params->snombre . "%' and ";
            }
        }
        if ($params->primerapellido != "") {
            if ($fonetica != '') {
                $fonetica = $mfnt->Conversion($params->primerapellido);
                $filtro .= " chf.fpapel = '" . $fonetica . "' and ";
                $filtro1 .= " chf1.fpapel = '" . $fonetica . "' and ";
            } else {
                $filtro .= " dp.papel ilike '%" . $params->primerapellido . "%' and ";
                $filtro1 .= " dp1.papel ilike '%" . $params->primerapellido . "%' and ";
            }
        }
        if ($params->segundoapellido != "") {
            if ($fonetica != '') {
                $fonetica = $mfnt->Conversion($params->segundoapellido);
                $filtro .= " chf.fsapel = '" . $fonetica . "' and ";
                $filtro1 .= " chf1.fsapel = '" . $fonetica . "' and ";
            } else {
                $filtro .= "dp.sapel ilike '%" . $params->segundoapellido . "%' and ";
                $filtro1 .= "dp1.sapel ilike '%" . $params->segundoapellido . "%' and ";
            }
        }
        if ($params->idpersona != "") {
            $filtro .= " dp.idpersona = '" . $params->idpersona . "' and ";
            $filtro1 .= " dp1.idpersona = '" . $params->idpersona . "' and ";
        }
        if ($params->idsexo != "") {
            $filtro .= " dp.idsexo = '" . $params->idsexo . "' and ";
            $filtro1 .= " dp1.idsexo = '" . $params->idsexo . "' and ";
        }
        if ($params->idcategoriapersona != "") {
            $filtro .= " dpc.id_categoria = '" . $params->idcategoriapersona . "' and ";
            $filtro1 .= " dpc1.id_categoria = '" . $params->idcategoriapersona . "' and ";
        }
        if ($params->tipoidentidad != "") {
            $filtro .= " dpdi.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
            $filtro1 .= " dpdi1.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
        }

        $in = "";
        if ($meta != null) {
            if ($params->tipoestructura == 1 or $params->tipoestructura == 2) {
                $arrEntidades = $meta->BuscarEntidadesXidestructura($params->idestructura);
                if ($arrEntidades) {
                    $in = "( ";
                    $i = 0;
                    foreach ($arrEntidades as $a) {
                        if ($i == 0)
                            $in = $in . $a['idestructura'];
                        else
                            $in = $in . ", " . $a['idestructura'];
                        $i++;
                    }
                    $in .= " )";
                    $filtro .= "doa.identidad in {$in} and ";
                    $filtro1 .= "doa.identidad in {$in} and ";
                }
            } else if ($params->tipoestructura == 3) {
                $filtro .= "doa.identidad = {$params->idestructura} and ";
                $filtro1 .= "doa1.identidad = {$params->idestructura} and ";
            } else if ($params->tipoestructura == 4 or $params->tipoestructura == 5) {
                $filtro .= "doa.idcargo = {$params->idestructura} and ";
                $filtro1 .= "doa1.idcargo = {$params->idestructura} and ";
            } else if ($params->tipoestructura == 9 or $params->tipoestructura == 10) {
                $arrCargos = $meta->BuscarCargosXidestructuraop($params->idestructura);
                $in = "( ";
                $i = 0;
                foreach ($arrCargos as $a) {
                    if ($i == 0)
                        $in = $in . $a['idcargo'];
                    else
                        $in = $in . ", " . $a['idcargo'];
                    $i++;
                }
                $in .= " )";
                $filtro .= "doa.idcargo in {$in} and ";
                $filtro1 .= "doa1.idcargo in {$in} and ";
            }
        }

        $filtro .= " (dp.fechaeliminado is null)";
        $filtro1 .= " (dp1.fechaeliminado is null)";

        $glob = ZendExt_GlobalConcept::getInstance();
        $idusuario = $glob->perfil->idusuario;

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        if ($permiso == 2) {
            $integratorIOC = ZendExt_IoC::getInstance();
            //Busco todos los cargos que el usuario logueado tiene acceso por dominio
            $arrCargos = $integratorIOC->metadatos->BuscarCargosbyDominio($idestructura);

            $arrIDsCargos = array();

            foreach ($arrCargos as $i => $v) {
                $arrIDsCargos[] = $v->idcargo;
            }
            //print_r($arrIDsCargos);die;
            //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
            $arrEntidades = $integratorIOC->metadatos->BuscarEntidadbyDominio($idestructura);
            //print_r($arrEntidades);die;
            $arrIDsEntidades = array();
            foreach ($arrEntidades as $i => $v) {
                $arrIDsEntidades[] = $v->identidad;
            }

            if ($arrIDsCargos) {
                $abrirParentisis = '';
                $sql = "( SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                        dp.idsituacionpersona, nsp.denom as situacionpersona, dp.idsituacionespecificapersona, date_part('year',age(dpn.fechanacimiento)) as annos,
                        dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, df.idfoto, df.extension, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
                        FROM mod_persona.dat_persona dp
                        INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.idcargo IN (" . implode(',', $arrIDsCargos) . "))
                        INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
                        LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
                        LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
                        LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
                        LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
                        left join mod_persona.dat_personanacimiento dpn ON (dp.idpersona = dpn.idpersona)
                        LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)
                        WHERE ";
                $sql .= $filtro . " ) UNION (";
            } else {
                $abrirParentisis = '(';
            }
            if ($arrIDsEntidades) {
                $sql .= "$abrirParentisis SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                    dp.idsituacionpersona, nsp.denom as situacionpersona, dp.idsituacionespecificapersona, date_part('year',age(dpn.fechanacimiento)) as annos,
                    dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, df.idfoto, df.extension, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
                    FROM mod_persona.dat_persona dp
                    INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.identidad IN (" . implode(',', $arrIDsEntidades) . ")  AND doa.idcargo is null)
                    INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
                    LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
                    LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
                    LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
                    LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
                    left join mod_persona.dat_personanacimiento dpn ON (dp.idpersona = dpn.idpersona)
                    LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)
                    WHERE ";
                $sql .= $filtro . " ) UNION ( ";
            }
            //Busco todas las personas que adiciono el usuario y que todavia no ha puesto en el cargo
            $sql .= " $abrirParentisis select DISTINCT(dp1.idpersona), dp1.numid, dp1.nombre, dp1.snombre, dp1.papel, dp1.sapel, dp1.idsexo, dp1.idcategoriapersona,
                    dp1.idsituacionpersona, nsp1.denom as situacionpersona, dp1.idsituacionespecificapersona,date_part('year',age(dpn1.fechanacimiento)) as annos,
                    dpdi1.idpersonaidentidad, dpdi1.idtipodocidentidad, df1.idfoto, df1.extension, npc1.denom as categoriapersona, ntdi1.denom as tipodocidentidad
                    from mod_persona.dat_persona dp1
                    inner join mod_persona.dat_personadocidentidad dpdi1 on (dpdi1.idpersona = dp1.idpersona  and dpdi1.actual = 1 and dpdi1.activo = 1)
                    inner join mod_persona.seg_personaaccesosindominio spasd1 on (spasd1.idpersonaacceso = dp1.idpersona and spasd1.idusuario = {$idusuario})
                    left join mod_persona.nom_categoriapersona npc1 on (npc1.idcategoriapersona = dp1.idcategoriapersona)
                    left join mod_persona.dat_ocupacionactual doa1 on (doa1.idpersona = dp1.idpersona)
                    left join mod_persona.nom_tipodocidentidad ntdi1 on (ntdi1.idtipodocidentidad = dpdi1.idtipodocidentidad)
                    left join mod_persona.nom_situacionpersona nsp1 on (nsp1.idsituacionpersona = dp1.idsituacionpersona)
                    left join mod_persona.dat_foto df1 on (df1.idpersona = dp1.idpersona)
                    left join mod_persona.dat_personanacimiento dpn1 ON (dp1.idpersona = dpn1.idpersona)
                    LEFT JOIN mod_persona.dat_chfonetica chf1 ON (chf1.idpersona = dp1.idpersona)
                    where  {$filtro1} )";
            $sql .= " order by nombre limit {$limite} offset {$inicio} ;";
            //die($sql);
            $resultado = $conn->fetchAll($sql);
        }//if($permiso == 2)
        else {
            $sql = "select DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                dp.idsituacionpersona, nsp.denom as situacionpersona, dp.idsituacionespecificapersona,
                date_part('year',age(dpn.fechanacimiento)) as annos, dpdi.idpersonaidentidad, dpdi.idtipodocidentidad,
                npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
                from mod_persona.dat_persona dp
                inner join mod_persona.dat_personadocidentidad dpdi on (dpdi.idpersona = dp.idpersona  and dpdi.actual = 1 and dpdi.activo = 1)
                left join mod_persona.dat_ocupacionactual doa on (doa.idpersona = dp.idpersona)
                left join mod_persona.nom_categoriapersona npc on (npc.idcategoriapersona = dp.idcategoriapersona)
                left join mod_persona.nom_tipodocidentidad ntdi on (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
                left join mod_persona.nom_situacionpersona nsp on (nsp.idsituacionpersona = dp.idsituacionpersona)
                LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
                left join mod_persona.dat_personanacimiento dpn ON (dp.idpersona = dpn.idpersona)
                LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)
		where ";
            $sql .= $filtro . " ";
            $sql .= " order by dp.nombre limit {$limite} offset {$inicio} ;";
            //die($sql);
            $resultado = $conn->fetchAll($sql);
        }
        return $resultado;
    }

    public function countntex($params, $idestructura, $iddominio, $permiso, $meta)
    {
        $filtro = '';
        $filtro1 = '';
        if ($params->numid != "") {
            $filtro .= " dp.numid ilike '%" . $params->numid . "%' and ";
            $filtro1 .= " dp1.numid ilike '%" . $params->numid . "%' and ";
        }
        if ($params->nombre != "") {
            if ($fonetica != '') {
                $fonetica = $mfnt->Conversion($params->nombre);
                $filtro .= " chf.fnom = '" . $fonetica . "' and ";
                $filtro1 .= " chf1.fnom = '" . $fonetica . "' and ";
            } else {
                $filtro .= "dp.nombre ilike '%" . $params->nombre . "%' and ";
                $filtro1 .= "dp1.nombre ilike '%" . $params->nombre . "%' and ";
            }
        }
        if ($params->snombre != "") {
            if ($fonetica != '') {
                $fonetica = $mfnt->Conversion($params->snombre);
                $filtro .= " chf.fsnom = '" . $fonetica . "' and ";
                $filtro1 .= " chf1.fsnom = '" . $fonetica . "' and ";
            } else {
                $filtro .= " dp.snombre ilike '%" . $params->snombre . "%' and ";
                $filtro1 .= " dp1.snombre ilike '%" . $params->snombre . "%' and ";
            }
        }
        if ($params->primerapellido != "") {
            if ($fonetica != '') {
                $fonetica = $mfnt->Conversion($params->primerapellido);
                $filtro .= " chf.fpapel = '" . $fonetica . "' and ";
                $filtro1 .= " chf1.fpapel = '" . $fonetica . "' and ";
            } else {
                $filtro .= " dp.papel ilike '%" . $params->primerapellido . "%' and ";
                $filtro1 .= " dp1.papel ilike '%" . $params->primerapellido . "%' and ";
            }
        }
        if ($params->segundoapellido != "") {
            if ($fonetica != '') {
                $fonetica = $mfnt->Conversion($params->segundoapellido);
                $filtro .= " chf.fsapel = '" . $fonetica . "' and ";
                $filtro1 .= " chf1.fsapel = '" . $fonetica . "' and ";
            } else {
                $filtro .= "dp.sapel ilike '%" . $params->segundoapellido . "%' and ";
                $filtro1 .= "dp1.sapel ilike '%" . $params->segundoapellido . "%' and ";
            }
        }
        if ($params->idpersona != "") {
            $filtro .= " dp.idpersona = '" . $params->idpersona . "' and ";
            $filtro1 .= " dp1.idpersona = '" . $params->idpersona . "' and ";
        }
        if ($params->idsexo != "") {
            $filtro .= " dp.idsexo = '" . $params->idsexo . "' and ";
            $filtro1 .= " dp1.idsexo = '" . $params->idsexo . "' and ";
        }
        if ($params->idcategoriapersona != "") {
            $filtro .= " dpc.id_categoria = '" . $params->idcategoriapersona . "' and ";
            $filtro1 .= " dpc1.id_categoria = '" . $params->idcategoriapersona . "' and ";
        }
        if ($params->tipoidentidad != "") {
            $filtro .= " dpdi.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
            $filtro1 .= " dpdi1.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
        }
        $in = "";
        if ($meta != null) {
            if ($params->tipoestructura == 1 or $params->tipoestructura == 2) {
                $arrEntidades = $meta->BuscarEntidadesXidestructura($params->idestructura);
                if ($arrEntidades) {
                    $in = "( ";
                    $i = 0;
                    foreach ($arrEntidades as $a) {
                        if ($i == 0)
                            $in = $in . $a['idestructura'];
                        else
                            $in = $in . ", " . $a['idestructura'];
                        $i++;
                    }
                    $in .= " )";
                    $filtro1 .= "doa1.identidad in {$in} and ";
                    $filtro .= "doa.identidad in {$in} and ";
                }
            } else if ($params->tipoestructura == 3) {
                $filtro .= "doa.identidad = {$params->idestructura} and ";
                $filtro1 .= "doa1.identidad = {$params->idestructura} and ";
            } else if ($params->tipoestructura == 4 or $params->tipoestructura == 5) {
                $filtro .= "doa.idcargo = {$params->idestructura} and ";
                $filtro1 .= "doa1.idcargo = {$params->idestructura} and ";
            } else if ($params->tipoestructura == 9 or $params->tipoestructura == 10) {
                $arrCargos = $meta->BuscarCargosXidestructuraop($params->idestructura);
                $in = "( ";
                $i = 0;
                foreach ($arrCargos as $a) {
                    if ($i == 0)
                        $in = $in . $a['idcargo'];
                    else
                        $in = $in . ", " . $a['idcargo'];
                    $i++;
                }
                $in .= " )";
                $filtro .= "doa.idcargo in {$in} and ";
                $filtro1 .= "doa1.idcargo in {$in} and ";
            }
        }

        $filtro .= ' (dp.fechaeliminado is null )';
        $filtro1 .= ' (dp1.fechaeliminado is null )';

        $glob = ZendExt_GlobalConcept::getInstance();
        $idusuario = $glob->perfil->idusuario;

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if ($permiso == 2) {
            $integratorIOC = ZendExt_IoC::getInstance();

            //Busco todos los cargos que el usuario logueado tiene acceso por dominio
            $arrCargos = $integratorIOC->metadatos->BuscarCargosbyDominio($idestructura);
            $arrIDsCargos = array();
            foreach ($arrCargos as $i => $v)
                $arrIDsCargos[] = $v->idcargo;

            //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
            $arrEntidades = $integratorIOC->metadatos->BuscarEntidadbyDominio($idestructura);
            $arrIDsEntidades = array();
            foreach ($arrEntidades as $i => $v) {
                $arrIDsEntidades[] = $v->identidad;
            }
            if ($arrIDsCargos) {
                $sql = "SELECT count(DISTINCT(dp.idpersona)) as cantidad
                        FROM mod_persona.dat_persona dp
                        INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.idcargo IN (" . implode(',', $arrIDsCargos) . "))
                        INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
                        LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
                        LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
                        LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
                        LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
                        left join mod_persona.dat_personanacimiento dpn ON (dp.idpersona = dpn.idpersona)
                        LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)
                        WHERE ";
                $sql .= $filtro;
            }
            $resultado1 = $conn->fetchAll($sql);
            if ($arrIDsEntidades) {
                $sql = "SELECT count(DISTINCT(dp.idpersona)) as cantidad
                    FROM mod_persona.dat_persona dp
                    INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.identidad IN (" . implode(',', $arrIDsEntidades) . ")  AND doa.idcargo is null)
                    INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
                    LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
                    LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
                    LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
                    LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
                    left join mod_persona.dat_personanacimiento dpn ON (dp.idpersona = dpn.idpersona)
                    LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)
                    WHERE ";
                $sql .= $filtro;
            }
            $resultado2 = $conn->fetchAll($sql);
            //Busco todas las personas que adiciono el usuario y que todavia no ha puesto en el cargo
            $sql = "SELECT count(DISTINCT(dp1.idpersona)) as cantidad
                    from mod_persona.dat_persona dp1
                    inner join mod_persona.dat_personadocidentidad dpdi1 on (dpdi1.idpersona = dp1.idpersona  and dpdi1.actual = 1 and dpdi1.activo = 1)
                    inner join mod_persona.seg_personaaccesosindominio spasd1 on (spasd1.idpersonaacceso = dp1.idpersona and spasd1.idusuario = {$idusuario})
                    left join mod_persona.dat_ocupacionactual doa1 on (doa1.idpersona = dp1.idpersona)
                    left join mod_persona.nom_categoriapersona npc1 on (npc1.idcategoriapersona = dp1.idcategoriapersona)
                    left join mod_persona.nom_tipodocidentidad ntdi1 on (ntdi1.idtipodocidentidad = dpdi1.idtipodocidentidad)
                    left join mod_persona.nom_situacionpersona nsp1 on (nsp1.idsituacionpersona = dp1.idsituacionpersona)
                    left join mod_persona.dat_foto df1 on (df1.idpersona = dp1.idpersona)
                    left join mod_persona.dat_personanacimiento dpn1 ON (dp1.idpersona = dpn1.idpersona)
                    LEFT JOIN mod_persona.dat_chfonetica chf1 ON (chf1.idpersona = dp1.idpersona)
                    where  {$filtro1} ";
            $resultado3 = $conn->fetchAll($sql);
            //die($sql);
            return $resultado1[0]['cantidad'] + $resultado2[0]['cantidad'] + $resultado3[0]['cantidad'];
        }//if($permiso == 2)
        else {
            $sql = "select count(DISTINCT(dp.idpersona)) as cantidad
                    from mod_persona.dat_persona dp
                    INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
                    left JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona)
                    left join mod_persona.nom_categoriapersona npc on (npc.idcategoriapersona = dp.idcategoriapersona)
                    left join mod_persona.nom_tipodocidentidad ntdi on (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
                    left join mod_persona.nom_situacionpersona nsp on (nsp.idsituacionpersona = dp.idsituacionpersona)
                    LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
                    left join mod_persona.dat_personanacimiento dpn ON (dp.idpersona = dpn.idpersona)
                    LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)

			where ";
            $sql .= $filtro . " ";
            //die($sql);
            $resultado = $conn->fetchAll($sql);
            return $resultado[0]['cantidad'];
        }
        return 0;
    }

    public function BuscarPersonaPorParam($params, $limite, $inicio, $idestructura, $iddominio, $permiso, $meta)
    {

        $filtro = '';
        if ($params->numid != "") {
            $filtro .= "dpdi.numero ilike '%" . $params->numid . "%' and ";
        }
        if ($params->nombre != "") {
            $filtro .= "lower(dp.nombre) ilike '%" . strtolower($params->nombre) . "%' and ";
        }
        if ($params->snombre != "") {
            $filtro .= "lower(dp.snombre) ilike '%" . strtolower($params->snombre) . "%' and ";
        }
        if ($params->primerapellido != "") {
            $filtro .= "lower(dp.papel) ilike '%" . strtolower($params->primerapellido) . "%' and ";
        }
        if ($params->segundoapellido != "") {
            $filtro .= "lower(dp.sapel) ilike '%" . strtolower($params->segundoapellido) . "%' and ";
        }
        if ($params->idpersona != "") {
            $filtro .= "dp.idpersona = '" . $params->idpersona . "' and ";
        }
        if ($params->idsexo != "") {
            $filtro .= "dp.idsexo = '" . $params->idsexo . "' and ";
        }
        if ($params->idcategoriapersona != "") {
            $filtro .= "dc.idcategoria = '" . $params->idcategoriapersona . "' and ";
        }
        if ($params->tipoidentidad != "") {
            $filtro .= "dpdi.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
        }

        $filtro .= " dp.feliminado is null";

        $integratorIOC = ZendExt_IoC::getInstance();
        //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
        //$arrEntidades = $integratorIOC->metadatos->BuscarEntidadesXidestructura($identidad);
        $arrIDsEntidades = array($idestructura);
        /* $arrIDsEntidades = array();
          foreach ($arrEntidades as $i => $v)
          $arrIDsEntidades[] = $v['idestructura']; */

        $sql .= "SELECT DISTINCT(dp.idpersona), dpdi.numero as numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, nc.idcategoria, nc.denominacion as categoriapersona
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona  = dp.idpersona AND dco.identidad IN (" . implode(',', $arrIDsEntidades) . ") AND (dco.fechavencimiento is null or dco.fechavencimiento >= now()))
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.dat_categorizacion dc ON (dc.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoria nc ON (nc.idcategoria = dc.idcategoria)
			WHERE ";
        $sql .= $filtro . " ";
        $sql .= " order by nombre limit {$limite} offset {$inicio} ;";
        //print_r($sql);die;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function countBuscarPersonaPorParam($params, $idestructura, $iddominio, $permiso, $meta)
    {
        $filtro = '';
        if ($params->numid != "") {
            $filtro .= "dpdi.numero ilike '%" . $params->numid . "%' and ";
        }
        if ($params->nombre != "") {
            $filtro .= "lower(dp.nombre) ilike '%" . strtolower($params->nombre) . "%' and ";
        }
        if ($params->snombre != "") {
            $filtro .= "lower(dp.snombre) ilike '%" . strtolower($params->snombre) . "%' and ";
        }
        if ($params->primerapellido != "") {
            $filtro .= "lower(dp.papel) ilike '%" . strtolower($params->primerapellido) . "%' and ";
        }
        if ($params->segundoapellido != "") {
            $filtro .= "lower(dp.sapel) ilike '%" . strtolower($params->segundoapellido) . "%' and ";
        }
        if ($params->idpersona != "") {
            $filtro .= "dp.idpersona = '" . $params->idpersona . "' and ";
        }
        if ($params->idsexo != "") {
            $filtro .= "dp.idsexo = '" . $params->idsexo . "' and ";
        }
        if ($params->idcategoriapersona != "") {
            $filtro .= "dc.idcategoria = '" . $params->idcategoriapersona . "' and ";
        }
        if ($params->tipoidentidad != "") {
            $filtro .= "dpdi.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
        }

        $filtro .= " dp.feliminado is null";

        $integratorIOC = ZendExt_IoC::getInstance();
        //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
        //$arrEntidades = $integratorIOC->metadatos->BuscarEntidadesXidestructura($identidad);
        $arrIDsEntidades = array($idestructura);
        /* $arrIDsEntidades = array();
          foreach ($arrEntidades as $i => $v)
          $arrIDsEntidades[] = $v['idestructura']; */

        $sql .= "SELECT count(dp.idpersona) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona  = dp.idpersona AND dco.identidad IN (" . implode(',', $arrIDsEntidades) . ") AND (dco.fechavencimiento is null or dco.fechavencimiento >= now()))
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.dat_categorizacion dc ON (dc.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoria nc ON (nc.idcategoria = dc.idcategoria)
			WHERE ";
        $sql .= $filtro . ";";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($sql);
        return $resultado[0]['cantidad'];
    }

    public function contarPersona()
    {
        try {

            $query = new Doctrine_Query();
            $result = $query
                ->select('dp.idpersona')
                ->from('DatPersona dp')
                ->innerJoin('dp.DatPersonadocidentidad dpdi')
                ->leftJoin('dp.DatFoto df')
                ->where('dp.fechaeliminado is null and dpdi.actual = ? and df.hasta is null', 1)
                ->count();
            //print_r($result);die('asasas');

            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetPorLimite($start, $limit)
    {
        try {
            //print_r($result);die;
            $query = new Doctrine_Query();
            $result = $query
                ->select('dp.idpersona, dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona, dp.idsituacionpersona, dp.idsituacionespecificapersona, dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, df.extension')
                ->from('DatPersona dp')
                ->innerJoin('dp.DatPersonadocidentidad dpdi')
                ->leftJoin('dp.DatFoto df')
                ->where('dp.fechaeliminado is null and dpdi.actual = ? and df.hasta is null', 1)
                ->orderBy('dp.nombre ASC')
                ->limit($limit)
                ->offset($start)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
            //print_r($result);die;
            foreach ($result as $k => $v) {
                $arr[$k]['idpersona'] = $v['idpersona'];
                $arr[$k]['numid'] = $v['numid'];
                $arr[$k]['nombre'] = $v['nombre'];
                $arr[$k]['snombre'] = $v['snombre'];
                $arr[$k]['papel'] = $v['papel'];
                $arr[$k]['sapel'] = $v['sapel'];
                $arr[$k]['idsexo'] = $v['idsexo'];
                $arr[$k]['idsituacionpersona'] = $v['idsituacionpersona'];
                $arr[$k]['situacionpersona'] = $this->devolverSituacionPersona($v['idsituacionpersona']);
                $arr[$k]['idsituacionespecificapersona'] = $v['idsituacionespecificapersona'];
                $arr[$k]['idcategoriapersona'] = $v['idcategoriapersona'];
                $arr[$k]['idtipodocidentidad'] = $v['DatPersonadocidentidad']['idtipodocidentidad'];
                $arr[$k]['serie'] = $v['DatPersonadocidentidad']['serie'];
                $arr[$k]['tipodocidentidad'] = $v['tipodocidentidad'];
                $arr[$k]['idpersonaidentidad'] = $v['DatPersonadocidentidad']['idpersonaidentidad'];
                $arr[$k]['idfoto'] = $v['DatFoto'][0]['idfoto'];
                $arr[$k]['extension'] = $v['DatFoto'][0]['extension'];
            }
            //print_r($arr);die;
            return $arr;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function ObtenerPersonas($limit = 15, $start = 0)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query
                ->select('dp.numid, dp.idpersona, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo')
                ->from('DatPersona dp')
                ->where('dp.fechaeliminado is null')
                ->orderBy('dp.nombre ASC')
                ->limit($limit)
                ->offset($start)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function ObtenerCantidadPersonas()
    {
        try {
            $query = new Doctrine_Query();
            $result = $query
                ->select('dp.idpersona')
                ->from('DatPersona dp')
                ->where('dp.fechaeliminado is null')
                ->count();
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function ExisteCI($id)
    {
        try {
            $array = array(0 => $id);
            $query = new Doctrine_Query ();
            $result = $query->select('dp.numid, dp.idpersona')
                ->from('DatPersona dp')
                ->where('dp.numid=?', $array)
                ->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function ExisteCIMod($id, $idpers)
    {
        try {
            $array = array(0 => $id, 1 => $idpers);
            $query = new Doctrine_Query ();
            $result = $query->select('dp.numid, dp.idpersona')
                ->from('DatPersona dp')
                ->where('dp.numid=? and dp.idpersona!=?', $array)
                ->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function Eliminar($object)
    {
        try {
            $DatPersona = $this->Buscar($object->idpersona);
            $DatPersona->fechaeliminado = date('Y/m/d'); //'d/m/Y'
            $DatPersona->save();
            return true;
        } catch (Doctrine_Exception $e) {
            //$this->conn->rollback();
            throw $e;
        }
    }

    public function EliminarCompleto($object)
    {
        try {
            $DatPersona = $this->Buscar($object->idpersona);
            //print_r($DatPersona);die('asasas');
            //$DatPersona->fechaeliminado = date('d/m/Y');
            $DatPersona->delete();
            return true;
        } catch (Doctrine_Exception $e) {
            //$this->conn->rollback();
            throw $e;
        }
    }

    public function buscarCategoriasPermisoUsuario($idpersonaconectada)
    {
        $arraycat = array();
        $sql .= "SELECT scc.idcategoria
                 FROM mod_nomina.seg_compartcargocategoria scc
                 WHERE scc.idpersona = ?
			     ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($sql, array($idpersonaconectada));
        foreach ($resultado as $i => $val) {
            array_push($arraycat, $val['idcategoria']);
        }
        return $arraycat;
    }

    public function BuscadorPersonaVialidad($inicio = 0, $limite = 20, $texto, $identidad)
    {
        $limite = 20;
        $where = '';
        $where1 = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                    $where1 .= $or . "dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%' ";
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        if ($where1 != '')
            $where1 = '( ' . $where1 . ' )';
        $where .= ($where != '') ? " and dp.idestructura =  $identidad and dp.feliminado is null" : "dp.idestructura =  $identidad and dp.feliminado is null";
        $sql = '';
        $sql .= "SELECT DISTINCT(dp.idpersona), dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo,
                (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre
            FROM mod_persona.dat_persona dp
        LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
        WHERE " . $where . "";
        $sql .= " order by nombre limit {$limite} offset {$inicio} ;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($sql);
        return $resultado;
    }

    public function countBuscadorPersonaVialidad($texto, $identidad)
    {
        $limite = 20;
        $where = '';
        $where1 = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                    $where1 .= $or . "dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%' ";
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        if ($where1 != '')
            $where1 = '( ' . $where1 . ' )';
        $where .= ($where != '') ? " and dp.idestructura =  $identidad and dp.feliminado is null" : "dp.idestructura =  $identidad and dp.feliminado is null";
        $sql = '';
        $sql .= "SELECT count(dp.idpersona)
            FROM mod_persona.dat_persona dp
        LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
        WHERE " . $where . "";
        $sql .= ";";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($sql);
        return $resultado;
    }


    public function BuscadorTodasPersonasSistema($inicio = 0, $limite = 20, $texto)
    {

        //$limite = 20;
        $where = '';
        $where1 = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                    $where1 .= $or . "dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%' ";
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        if ($where1 != '')
            $where1 = '( ' . $where1 . ' )';
        $where .= ($where != '') ? "AND dp.feliminado is null" : " dp.feliminado is null";
        $sql = '';
        $sql .= "SELECT DISTINCT(dp.idpersona), dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo,
                (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre
            FROM mod_persona.dat_persona dp
        LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
        WHERE " . $where . "";
        $sql .= " order by nombre limit {$limite} offset {$inicio} ;";
        //print_r($sql);die;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($sql);
        // print_r($resultado);die;
        return $resultado;
    }

    public function countBuscadorTodasPersonasSistema($texto)
    {
        //$limite = 20;
        $where = '';
        $where1 = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                    $where1 .= $or . "dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%' ";
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        if ($where1 != '')
            $where1 = '( ' . $where1 . ' )';
        $where .= ($where != '') ? "AND dp.feliminado is null" : " dp.feliminado is null";
        $sql = '';
        $sql .= "SELECT count(dp.idpersona)
            FROM mod_persona.dat_persona dp
        LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
        WHERE " . $where . "";
        $sql .= ";";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);

        if (count($result) > 0)
            $resultado = $result[0]['count'];
        else
            $resultado = 0;
        return $resultado;
    }

    public function Buscador($inicio = 0, $limite = 20, $texto, $identidad, $iddominio, $permiso, $arraycategorias = null, $arrayidplantillas = null, $categoriapersonabuscar = null)
    {

        //$limite = 20;
        $where = '';
        $where1 = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                    $where1 .= $or . "dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%' ";
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        if ($where1 != '')
            $where1 = '( ' . $where1 . ' )';
        $where .= ($where != '') ? ' and (dp.feliminado is null and doc.fhasta is null and dco.idcargo is not null)' : ' dp.feliminado is null and doc.fhasta is null and dco.idcargo is not null';
        $where1 .= ($where1 != '') ? ' and (dp1.feliminado is null)' : ' dp1.feliminado is null';
        if (count($arrayidplantillas) > 0) {
            $where .= ($where != '') ? ' and cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')' : 'cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')';
        }
        $sql = '';
        if ($arraycategorias->cliente == 'MINFAR') {
            if (count($arraycategorias->arraycategorias) > 0) {
                $sql .= "SELECT DISTINCT(dp.idpersona), dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo, dpcat.idcategoria,
                    (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                    (CASE WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
                    (CASE WHEN cpn.denominacion <> '' THEN cpn.denominacion ELSE 'Sin plantilla nominal' END) as plantilla,
                npc.denominacion as categoriapersona
                FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_personaentidad doc ON (doc.idpersona = dp.idpersona AND doc.identidad = " . $identidad . ")
			INNER JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = doc.idpersonaentidad)
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal)
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			INNER JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			INNER JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
			WHERE " . ($where == '') ? "and dp.idpersona in (" . implode(',', $arraycategorias->arraycategorias) . ")" : "" . "";
                $sql .= " order by dp.nombre ASC limit {$limite} offset {$inicio} ;";
            } else {
                return array();
            }
        } else {
            $sql .= "SELECT DISTINCT(dp.idpersona), dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo, dpcat.idcategoria, cpn.orden,
                    (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                    (CASE WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
                    (cpn.orden ||'-'|| (CASE WHEN cpn.denominacion <> '' THEN cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,

                npc.denominacion as categoriapersona
                FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_personaentidad doc ON (doc.idpersona = dp.idpersona AND doc.identidad = " . $identidad . ")
			INNER JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = doc.idpersonaentidad)
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal)
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
			WHERE " . $where . "";
            $sql .= " order by dp.nombre ASC limit {$limite} offset {$inicio} ;";
        }

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($sql);
        return $resultado;
    }

    public function countBuscador($texto, $identidad, $iddominio, $permiso, $arraycategorias = null, $arrayidplantillas = null)
    {
        $where = '';
        $where1 = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . "dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                    $where1 .= $or . "dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%' ";
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        if ($where != '')
            $where1 = '( ' . $where1 . ' )';
        $where .= ($where != '') ? ' and (dp.feliminado is null and doc.fhasta is null and dco.idcargo is not null)' : ' dp.feliminado is null and doc.fhasta is null and dco.idcargo is not null';
        $where1 .= ($where1 != '') ? ' and (dp1.feliminado is null)' : ' dp1.feliminado is null';
        if (count($arrayidplantillas) > 0) {
            $where .= ($where != '') ? ' and cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')' : 'cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')';
        }
        $sql = '';
        if ($arraycategorias->cliente == 'MINFAR') {
            if (count($arraycategorias->arraycategorias) > 0) {
                $sql = "SELECT count(*) as cantidad
                FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_personaentidad doc ON (doc.idpersona = dp.idpersona AND doc.identidad = " . $identidad . ")
			INNER JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = doc.idpersonaentidad)
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal)
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			INNER JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			INNER JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
			WHERE " . ($where == '') ? "and dp.idpersona in (" . implode(',', $arraycategorias->arraycategorias) . ")" : "" . "";
            } else {
                return array();
            }
        } else {
            $sql = "SELECT count(*) as cantidad
                FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_personaentidad doc ON (doc.idpersona = dp.idpersona AND doc.identidad = " . $identidad . ")
			INNER JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = doc.idpersonaentidad)
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal)
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
			WHERE " . $where . "";
        }

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($sql);
        return $resultado;
    }

    public function BuscadorPorCategoria($inicio = 0, $limite = 20, $texto, $idestructura, $iddominio, $permiso, $arridcategoriapersona, $distinto)
    {
        $where = '';
        $where1 = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.numid ilike '%$arreglo[$i]%' or dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                    $where1 .= $or . " dp1.numid ilike '%$arreglo[$i]%' or dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%' ";
                }
            }
        }
        $in = "not in";
        if ($distinto != 1)
            $in = "in";
        if ($where != '')
            $where = '( ' . $where . ' )  and npc.idcategoriapersona ' . $in . ' (' . implode(',', $arridcategoriapersona) . ') ';
        else
            $where = 'npc.idcategoriapersona ' . $in . ' (' . implode(',', $arridcategoriapersona) . ') ';
        if ($where1 != '')
            $where1 = '( ' . $where1 . ' )  and npc.idcategoriapersona ' . $in . ' (' . implode(',', $arridcategoriapersona) . ') ';
        else
            $where1 = 'npc1.idcategoriapersona ' . $in . ' (' . implode(',', $arridcategoriapersona) . ') ';
        $where .= ($where != '') ? ' and (dp.fechaeliminado is null and df.hasta is null)' : ' dp.fechaeliminado is null and df.hasta is null';
        $where1 .= ($where1 != '') ? ' and (dp1.fechaeliminado is null and df1.hasta is null)' : ' dp1.fechaeliminado is null and df1.hasta is null';
        //die($where);
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if ($permiso == 2) {
            $glob = ZendExt_GlobalConcept::getInstance();
            $idusuario = $glob->Perfil->idusuario;
            $sql .= " SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                dp.idsituacionpersona, nsp.denom as situacionpersona,
                dp.idsituacionespecificapersona,
                dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, df.idfoto, df.extension, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
			LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
			LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
			LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
			WHERE ";
            $sql .= $where;
            $sql .= " order by nombre limit {$limite} offset {$inicio} ;";
            $resultado = $conn->fetchAll($sql);
        }//if($permiso == 2)
        else if ($permiso == 1) {
            $sql = "SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                dp.idsituacionpersona, nsp.denom as situacionpersona,
                dp.idsituacionespecificapersona,
                dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, df.idfoto, df.extension, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
			LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
			LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
			LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
			WHERE " . $where;
            $sql .= " order by nombre limit {$limite} offset {$inicio} ;";

            $resultado = $conn->fetchAll($sql);
        } else if ($permiso == 3) {
            $objIoC = ZendExt_IoC::getInstance();
            $arrTodosUsers = $objIoC->seguridad->getUsersPersonInformation(); //Obtengo todas las personas asociadas con usuarios
            //print_r($arrTodosUsers);die;
            if (count($arrTodosUsers) > 0) {
                $arrIDPersonas = array();
                foreach ($arrTodosUsers as $i => $v) {
                    $arrIDPersonas[] = $v['idpersona'];
                }
                $sql = "SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                dp.idsituacionpersona, nsp.denom as situacionpersona,
                dp.idsituacionespecificapersona,
                dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, df.idfoto, df.extension, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
			LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
			LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
			LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
			WHERE " . $where;
                $sql .= " and dp.idpersona in (" . implode(',', $arrIDPersonas) . ")";
                $sql .= " order by nombre limit {$limite} offset {$inicio} ;";
                $resultado = $conn->fetchAll($sql);
                foreach ($resultado as $i => &$v) {
                    $v['idusuario'] = $arrTodosUsers[$i]['idusuario'];
                    $v['nombreusuario'] = $arrTodosUsers[$i]['nombreusuario'];
                }
            } else
                $resultado = array();
        } else
            $resultado = array();

        return $resultado;
    }

    public function countBuscadorPorCategoria($texto, $idestructura, $iddominio, $permiso, $arridcategoriapersona, $distinto)
    {
        $where = '';
        $where1 = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.numid ilike '%$arreglo[$i]%' or dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                    $where1 .= $or . " dp1.numid ilike '%$arreglo[$i]%' or dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%' ";
                }
            }
        }
        $in = "not in";
        if ($distinto != 1)
            $in = "in";
        if ($where != '')
            $where = '( ' . $where . ' )  and npc.idcategoriapersona ' . $in . ' (' . implode(',', $arridcategoriapersona) . ') ';
        else
            $where = 'npc.idcategoriapersona ' . $in . ' (' . implode(',', $arridcategoriapersona) . ') ';
        if ($where1 != '')
            $where1 = '( ' . $where1 . ' )  and npc.idcategoriapersona ' . $in . ' (' . implode(',', $arridcategoriapersona) . ') ';
        else
            $where1 = 'npc1.idcategoriapersona ' . $in . ' (' . implode(',', $arridcategoriapersona) . ') ';
        $where .= ($where != '') ? ' and (dp.fechaeliminado is null and df.hasta is null)' : ' dp.fechaeliminado is null and df.hasta is null';
        $where1 .= ($where1 != '') ? ' and (dp1.fechaeliminado is null and df1.hasta is null)' : ' dp1.fechaeliminado is null and df1.hasta is null';

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if ($permiso == 2) {
            $glob = ZendExt_GlobalConcept::getInstance();
            $idusuario = $glob->Perfil->idusuario;
            $sql .= " SELECT count(*) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
			LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
			LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
			LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
			WHERE ";
            $sql .= $where;
            $result = $conn->fetchAll($sql);
            $resultado = $result[0]['cantidad'];
        }//if($permiso == 2)
        else if ($permiso == 1) {
            $sql = "SELECT count(*) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
			LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
			LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
			LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
			WHERE " . $where;

            $result = $conn->fetchAll($sql);

            if (count($result) > 0)
                $resultado = $result[0]['cantidad'];
            else
                $resultado = 0;
        } else
            $resultado = 0;
        return $resultado;
    }

    public function DevolverPersonasArregloId($arrIdPersonas)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query
                ->select('dp.idpersona, dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona')//, dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, df.extension
                ->from('DatPersona dp')
                ->whereIn('dp.idpersona', $arrIdPersonas)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function DevolverTodas()
    {
        try {
            $query = new Doctrine_Query ();
            $result = $query->select('dp.*')
                ->from('DatPersona dp')
                ->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function DevolverTodasLimit($start, $limit)
    {
        try {
            $query = new Doctrine_Query ();
            $result = $query->select('dp.*')
                ->from('DatPersona dp')
                ->limit($limit)
                ->offset($start)
                ->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function contarPersonaService()
    {
        try {
            $query = new Doctrine_Query();
            $result = $query
                ->select('dp.idpersona')
                ->from('DatPersona dp')
                ->count();
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function getIdFoto($idpersona)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query
                ->select('df.idfoto')
                ->from('DatFoto df')
                ->where('df.idpersona=?', $idpersona)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetDatosPrincipalesPersonaById($arridPersona)
    {

        $in = "( ";
        $i = 0;
        foreach ($arridPersona as $a) {
            if ($i == 0)
                $in = $in . $a;
            else
                $in = $in . ", " . $a;
            $i++;
        }
        $in .= " )";

        $sql = "select DISTINCT(per.idpersona), per.numid, per.nombre, per.snombre, per.papel, per.sapel, sex.denom as sexo, catg.denom as categoria,
				ident.idpersonaidentidad, nac.fechanacimiento as fechanacimiento,ni.denom as tipodocidentidad,
				ac.idgradomilitar,ac.idacumulativodegrado,ocup.numorden,ocup.fechainicioorden,ocup.idcargo,ocup.idocupacionactual,fot.idfoto as idfoto,
				fot.foto as foto,fot.extension as extension,
				ns.denom as situacionpersona,ocup.entidad,
				per.idsituacionespecificapersona,
				per.idsituacionpersona
                from mod_persona.dat_persona per
                inner join mod_persona.nom_situacionpersona ns on (ns.idsituacionpersona = per.idsituacionpersona)
                inner join mod_persona.nom_sexo sex on (sex.idsexo = per.idsexo)
                left join mod_persona.nom_categoriapersona catg on (catg.idcategoriapersona = per.idcategoriapersona)
				inner join mod_persona.dat_personadocidentidad ident on (ident.idpersona = per.idpersona  and ident.actual = 1 and ident.activo = 1)
				left join mod_persona.nom_tipodocidentidad ni on (ni.idtipodocidentidad = ident.idtipodocidentidad)
				left join mod_persona.dat_personanacimiento nac on (nac.idpersona = per.idpersona)
				left join mod_persona.dat_ocupacionactual ocup on (ocup.idpersona = per.idpersona)
                left join mod_persona.dat_acumulativodegrados ac on (ac.idpersona = per.idpersona and ac.fechafin is null )
                left join mod_persona.dat_foto fot on (fot.idpersona = per.idpersona and fot.hasta is null and fot.activo = 1)
				where per.fechaeliminado is null and per.idpersona in " . $in;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function GetDatosPrincipalesPersonaByIda($arridPersona)
    {

        $in = "( ";
        $i = 0;
        foreach ($arridPersona as $a) {
            if ($i == 0)
                $in = $in . $a;
            else
                $in = $in . ", " . $a;
            $i++;
        }
        $in .= " )";
        $sql = "select per.idpersona, per.numid, per.nombre, per.snombre, per.papel, per.sapel, sex.denom as sexo, catg.denom as categoria,
				ident.idpersonaidentidad, nac.fechanacimiento as fechanacimiento,ni.denom as tipodocidentidad,
				ac.idgradomilitar,ac.idacumulativodegrado,ocup.numorden,ocup.fechainicioorden,ocup.idcargo,ocup.idocupacionactual,fot.idfoto as idfoto,
				fot.foto as foto,fot.extension as extension,
				ns.denom as situacionpersona,
				per.idsituacionespecificapersona,
				per.idsituacionpersona
                from mod_persona.dat_persona per
                inner join mod_persona.nom_situacionpersona ns on (ns.idsituacionpersona = per.idsituacionpersona)
                inner join mod_persona.nom_sexo sex on (sex.idsexo = per.idsexo)
                left join mod_persona.nom_categoriapersona catg on (catg.idcategoriapersona = per.idcategoriapersona)
				left join mod_persona.dat_personadocidentidad ident on (ident.idpersona = per.idpersona  and ident.actual = 1 and ident.activo = 1)
				left join mod_persona.nom_tipodocidentidad ni on (ni.idtipodocidentidad = ident.idtipodocidentidad)
				left join mod_persona.dat_personanacimiento nac on (nac.idpersona = per.idpersona)
				left join mod_persona.dat_ocupacionactual ocup on (ocup.idpersona = per.idpersona)
                left join mod_persona.dat_acumulativodegrados ac on (ac.idpersona = per.idpersona and ac.fechafin is null)
                left join mod_persona.dat_foto fot on (fot.idpersona = per.idpersona and fot.hasta is null)
				where per.fechaeliminado is null and per.idpersona in " . $in;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function GetDatosPersonaparacuotasById($arrIdPersonas, $idestructura, $iddominio, $permiso)
    {
        if (is_array($arrIdPersonas)) {
            if (count($arrIdPersonas) > 0) {
                $in = "( ";
                $i = 0;
                foreach ($arrIdPersonas as $a) {
                    if ($i == 0)
                        $in = $in . $a;
                    else
                        $in = $in . ", " . $a;
                    $i++;
                }
                $in .= " )";

                $sql = "select DISTINCT(per.idpersona), per.numid, per.nombre, per.snombre, per.papel, per.sapel,
			        ns.denom as sexo, ncp.idcategoriapersona, ncp.denom as categoria, nsp.denom as situacion, ntdoc.denom, fot.extension,
                    	(CASE WHEN per.snombre is not null THEN
                    	per.nombre||' '|| per.snombre||' '|| per.papel||' '||  per.sapel
                    	ELSE per.nombre||' '|| per.papel||' '||  per.sapel END) as nombreapellidos,
                    ocup.idcargo, ocup.identidad as idestructura, ac.idgradomilitar, grado.dengradomilit as gradomilitar, de.codigo as entidad,
                    	(CASE WHEN dcm.idcargo is not null THEN ncm.dencargomilitar
                    	     WHEN dcc.idcargo is not null THEN ncc.dencargociv
                    	END) as cargo
                    from mod_persona.dat_persona per
                    inner join mod_persona.dat_personadocidentidad ident on (ident.idpersona = per.idpersona  and ident.actual = 1 and ident.activo = 1)
                    left join mod_persona.dat_ocupacionactual ocup on (ocup.idpersona = per.idpersona)
                    left join mod_persona.dat_acumulativodegrados ac on (ac.idpersona = per.idpersona and ac.fechafin is null)
                    left join mod_estructuracomp.nom_gradomilit grado on (grado.idgradomilit = ac.idgradomilitar)
                    left join mod_estructuracomp.dat_estructura de on (de.idestructura = ocup.identidad)
                    left join mod_estructuracomp.dat_cargocivil dcc on (dcc.idcargo = ocup.idcargo)
                    left join mod_estructuracomp.dat_cargomtar dcm on (dcm.idcargo = ocup.idcargo)
                    left join mod_estructuracomp.nom_cargocivil ncc on (ncc.idcargociv = dcc.idcargociv)
                    left join mod_estructuracomp.nom_cargomilitar ncm on (ncm.idcargomilitar = dcm.idcargomilitar)
                    left join mod_persona.nom_categoriapersona ncp on (ncp.idcategoriapersona = per.idcategoriapersona)
                    left join mod_persona.nom_sexo ns on (ns.idsexo = per.idsexo)
					left join mod_persona.nom_situacionpersona nsp on (nsp.idsituacionpersona = per.idsituacionpersona)
					left join mod_persona.dat_personadocidentidad doc on (doc.idpersona = per.idpersona)
					left join mod_persona.nom_tipodocidentidad ntdoc on (ntdoc.idtipodocidentidad = doc.idtipodocidentidad)
					left join mod_persona.dat_foto fot on (fot.idpersona = per.idpersona and fot.hasta is null)
                    where per.fechaeliminado is null and per.idpersona in " . $in;
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $result = $conn->fetchAll($sql);
                return $result;
            } else
                return array();
        } else
            return array();
    }

    public function BuscarDatosPersCPorDatos($arrPer, $estrucarray, $datos)
    {
        if (is_array($arrPer) && is_array($estrucarray)) {
            if (count($arrPer) > 0) {


                $in = "( ";
                $i = 0;
                foreach ($arrPer as $a) {
                    if ($i == 0)
                        $in = $in . $a['idpersona'];
                    else
                        $in = $in . ", " . $a['idpersona'];
                    $i++;
                }
                $in .= " )";

                $filtro = '';
                if ($datos->nomb != '') {
                    $arreglo = split(' ', $datos->nomb);
                    $filtro .= " and (";
                    for ($i = 0; $i < count($arreglo); $i++) {
                        if ($arreglo[$i]) {
                            $filtro .= " per.nombre ilike '%$arreglo[$i]%' or per.snombre ilike '%$arreglo[$i]%' or per.papel ilike '%$arreglo[$i]%' or per.sapel ilike '%$arreglo[$i]%' ";
                        }
                    }
                    $filtro .= ")";
                }
                if (count($estrucarray) > 0) {
                    $filtro .= " and ocup.identidad in ( ";
                    $i2 = 0;
                    foreach ($estrucarray as $e) {
                        if ($i2 == 0)
                            $filtro .= $e['idestructura'];
                        else
                            $filtro .= ", " . $e['idestructura'];
                        $i2++;
                    }
                    $filtro .= " )";
                }

                if ($datos->idgrad != '') {
                    $filtro .= " and ac.idgradomilitar = " . $datos->idgrad;
                }

                $sql = "select DISTINCT(per.idpersona), per.numid, per.nombre, per.snombre, per.papel, per.sapel,
			        ns.denom as sexo, ncp.denom as categoria, nsp.denom as situacion, ntdoc.denom, fot.extension,
                    	(CASE WHEN per.snombre is not null THEN
                    	per.nombre||' '|| per.snombre||' '|| per.papel||' '||  per.sapel
                    	ELSE per.nombre||' '|| per.papel||' '||  per.sapel END) as nombreapellidos,
                    ocup.idcargo, ocup.identidad as idestructura, ac.idgradomilitar, grado.dengradomilit as gradomilitar, de.codigo as entidad,
                    	(CASE WHEN dcm.idcargo is not null THEN ncm.dencargomilitar
                    	     WHEN dcc.idcargo is not null THEN ncc.dencargociv
                    	END) as cargo
                    from mod_persona.dat_persona per
                    inner join mod_persona.dat_personadocidentidad ident on (ident.idpersona = per.idpersona  and ident.actual = 1 and ident.activo = 1)
                    left join mod_persona.dat_ocupacionactual ocup on (ocup.idpersona = per.idpersona)
                    left join mod_persona.dat_acumulativodegrados ac on (ac.idpersona = per.idpersona and ac.fechafin is null)
                    left join mod_estructuracomp.nom_gradomilit grado on (grado.idgradomilit = ac.idgradomilitar)
                    left join mod_estructuracomp.dat_estructura de on (de.idestructura = ocup.identidad)
                    left join mod_estructuracomp.dat_cargocivil dcc on (dcc.idcargo = ocup.idcargo)
                    left join mod_estructuracomp.dat_cargomtar dcm on (dcm.idcargo = ocup.idcargo)
                    left join mod_estructuracomp.nom_cargocivil ncc on (ncc.idcargociv = dcc.idcargociv)
                    left join mod_estructuracomp.nom_cargomilitar ncm on (ncm.idcargomilitar = dcm.idcargomilitar)
                    left join mod_persona.nom_categoriapersona ncp on (ncp.idcategoriapersona = per.idcategoriapersona)
                    left join mod_persona.nom_sexo ns on (ns.idsexo = per.idsexo)
					left join mod_persona.nom_situacionpersona nsp on (nsp.idsituacionpersona = per.idsituacionpersona)
					left join mod_persona.dat_personadocidentidad doc on (doc.idpersona = per.idpersona)
					left join mod_persona.nom_tipodocidentidad ntdoc on (ntdoc.idtipodocidentidad = doc.idtipodocidentidad)
					left join mod_persona.dat_foto fot on (fot.idpersona = per.idpersona and fot.hasta is null)
                    where per.fechaeliminado is null and per.idpersona in " . $in . $filtro;
                //print_r($sql);die;
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $result = $conn->fetchAll($sql);
                return $result;
            } else
                return array();
        } else
            return array();
    }

    public function GetDatosPersonaparajabber($idpersona)
    {
        $arrDatGenerales = $this->GetDatosPrincipalesPersonaById(array($idpersona));
        if (count($arrDatGenerales) > 0) {
            $resultado = array();
            $resultado['sexo'] = $arrDatGenerales[0]['sexo'];
            $resultado['fechanacimiento'] = $arrDatGenerales[0]['fechanacimiento'];
            $resultado['nombre'] = $arrDatGenerales[0]['nombre'] . ($arrDatGenerales[0]['snombre'] != '' ? ' ' . $arrDatGenerales[0]['snombre'] : '');
            $resultado['apellidos'] = $arrDatGenerales[0]['papel'] . ' ' . $arrDatGenerales[0]['sapel'];
            /* Busco los cargos de la persona */
            $objOcuAct = new DatOcupacionActual();
            $arrIDsCargos = $objOcuAct->obtenerIdsCargosActualesporPersona($idpersona);
            if (count($arrIDsCargos) > 0) {
                $ids = array();
                foreach ($arrIDsCargos as $i => $v) {
                    $ids[] = $v['idcargo'];
                }
                $objIoC = ZendExt_IoC::getInstance();
                $arrcargos = $objIoC->metadatos->BuscardatosdelCargoporarrIDs($ids);
                $resultado['ocupacion'] = $arrcargos;
            } else
                $resultado['ocupacion'] = array();

            /* Conformo la direccion de la foto de la persona */
            $dirfoto = '/pvd/repositorio_persona/persona/views/js/registropersonavn/persona.jpg';
            if ($arrDatGenerales[0]['extension'] != '') {
                $dirfoto = '/pvd/repositorio_persona/persona/personaimgs/' . $idpersona . $arrDatGenerales[0]['extension'];
            }
            $resultado['foto'] = $dirfoto;

            /* Busco los correos electronicos de la persona */
            $objContactos = new DatContacto();
            $resultado['correoelectronico'] = $objContactos->GetCorreoEltronicoPorIDPersona($idpersona);

            return $resultado;
        } else
            return array();
    }

    public function GetDatosPersonaparaseguridadById($id)
    {

        $sql = "select dp.idpersona,(CASE WHEN dp.snombre is null THEN (dp.nombre ||' '||dp.papel ||' '||dp.sapel) ELSE (dp.nombre ||' '||dp.snombre||' '||dp.papel ||' '||dp.sapel) END ) as nombreapellidos, df.extension, dpn.fechanacimiento, numid, ns.denom as sexo
                from mod_persona.dat_persona dp
                left join mod_persona.dat_personanacimiento dpn on (dpn.idpersona = dp.idpersona)
                left join mod_persona.dat_foto df on (dpn.idpersona = df.idpersona)
                left join mod_persona.nom_sexo ns on (dp.idsexo = ns.idsexo)
                where dp.fechaeliminado is null ";
        if (is_array($id)) {
            $sql .= " and dp.idpersona in (" . implode(',', $id) . ") ;";
        } else {
            $sql .= " and dp.idpersona  = {$id}";
        }
        //die($sql);
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function GetDatosSegpersonaByarrayId($arrayIDsPersona)
    {

        $sql = "select dp.idpersona,(CASE WHEN dp.snombre is null THEN (dp.nombre ||' '||dp.papel ||' '||dp.sapel) ELSE (dp.nombre ||' '||dp.snombre||' '||dp.papel ||' '||dp.sapel) END ) as nombreapellidos, dp.numid, sp.permiso, sp.idpersonapermisos
                from mod_persona.dat_persona dp
				left join mod_persona.seg_personapermisos sp on (sp.idpersona = dp.idpersona)
                where dp.fechaeliminado is null ";
        if (is_array($arrayIDsPersona)) {
            $sql .= " and dp.idpersona in (" . implode(',', $arrayIDsPersona) . ") ;";
        } else {
            $sql .= " and dp.idpersona  = {$arrayIDsPersona}";
        }
        //die($sql);
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function GetSeguridadPersonaparaByArrayId($arridpersona)
    {
        $sql = "select dp.idpersona, dp.numid,(CASE WHEN dp.snombre is null THEN (dp.nombre ||' '||dp.papel ||' '||dp.sapel) ELSE (dp.nombre ||' '||dp.snombre||' '||dp.papel ||' '||dp.sapel) END ) as nombreapellidos,
				spp.idpersonapermisos, spp.permiso
                from mod_persona.dat_persona dp
                left join mod_persona.seg_personapermisos spp on (spp.idpersona = dp.idpersona)
                where dp.fechaeliminado is null ";
        if (is_array($arridpersona)) {
            $sql .= " and dp.idpersona in (" . implode(',', $arridpersona) . ") ;";
        } else {
            $sql .= " and dp.idpersona  = {$arridpersona}";
        }
        //die($sql);
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function BuscarPersonaPorParamCC($params, $limite, $inicio, $idestructura, $iddominio, $permiso, $meta)
    {
        $filtro = '';
        $filtro1 = '';
        if ($params->numid != "") {
            $filtro .= "dp.numid like '%" . $params->numid . "%' and ";
            $filtro1 .= "dp1.numid like '%" . $params->numid . "%' and ";
        }
        if ($params->nombre != "") {
            $filtro .= "lower(dp.nombre) like '%" . strtolower($params->nombre) . "%' and ";
            $filtro1 .= "lower(dp1.nombre) like '%" . strtolower($params->nombre) . "%' and ";
        }
        if ($params->snombre != "") {
            $filtro .= "lower(dp.snombre) like '%" . strtolower($params->snombre) . "%' and ";
            $filtro1 .= "lower(dp1.snombre) like '%" . strtolower($params->snombre) . "%' and ";
        }
        if ($params->primerapellido != "") {
            $filtro .= "lower(dp.papel) like '%" . strtolower($params->primerapellido) . "%' and ";
            $filtro1 .= "lower(dp1.papel) like '%" . strtolower($params->primerapellido) . "%' and ";
        }
        if ($params->segundoapellido != "") {
            $filtro .= "lower(dp.sapel) like '%" . strtolower($params->segundoapellido) . "%' and ";
            $filtro1 .= "lower(dp1.sapel) like '%" . strtolower($params->segundoapellido) . "%' and ";
        }
        if ($params->idpersona != "") {
            $filtro .= "dp.idpersona = '" . $params->idpersona . "' and ";
            $filtro1 .= "dp1.idpersona = '" . $params->idpersona . "' and ";
        }
        if ($params->idsexo != "") {
            $filtro .= "dp.idsexo = '" . $params->idsexo . "' and ";
            $filtro1 .= "dp1.idsexo = '" . $params->idsexo . "' and ";
        }
        if ($params->idcategoriapersona != "") {
            $filtro .= "dp.idcategoriapersona = '" . $params->idcategoriapersona . "' and ";
            $filtro1 .= "dp1.idcategoriapersona = '" . $params->idcategoriapersona . "' and ";
        }
        if ($params->tipoidentidad != "") {
            $filtro .= "dpdi.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
            $filtro1 .= "dpdi1.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
        }
        $in = "";
        if ($meta != null) {
            if ($params->tipoestructura == 1 or $params->tipoestructura == 2) {
                $arrEntidades = $meta->BuscarEntidadesXidestructura($params->idestructura);
                $in = "( ";
                $i = 0;
                foreach ($arrEntidades as $a) {
                    if ($i == 0)
                        $in = $in . $a['idestructura'];
                    else
                        $in = $in . ", " . $a['idestructura'];
                    $i++;
                }
                $in .= " )";

                $filtro .= "doa.identidad in {$in} and ";
            } else if ($params->tipoestructura == 3) {
                $filtro .= "doa.identidad = {$params->idestructura} and ";
            } else if ($params->tipoestructura == 4 or $params->tipoestructura == 5) {
                $filtro .= "doa.idcargo = {$params->idestructura} and ";
            } else if ($params->tipoestructura == 9 or $params->tipoestructura == 10) {
                $arrCargos = $meta->BuscarCargosXidestructuraop($params->idestructura);
                $in = "( ";
                $i = 0;
                foreach ($arrCargos as $a) {
                    if ($i == 0)
                        $in = $in . $a['idcargo'];
                    else
                        $in = $in . ", " . $a['idcargo'];
                    $i++;
                }
                $in .= " )";

                $filtro .= "doa.idcargo in {$in} and ";
            }
        }
        $filtro .= " dp.fechaeliminado is null";
        $filtro1 .= " dp1.fechaeliminado is null";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if ($permiso == 2) {
            $glob = ZendExt_GlobalConcept::getInstance();
            $idusuario = $glob->perfil->idusuario;
            $integratorIOC = ZendExt_IoC::getInstance();

            //Busco todos los cargos que el usuario logueado tiene acceso por dominio
            $arrCargos = $integratorIOC->metadatos->obtenerCargosEstructura($idestructura);
            $arrIDsCargos = array();
            foreach ($arrCargos as $i => $v)
                $arrIDsCargos[] = $v['idcargo'];

            //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
            $arrEntidades = $integratorIOC->metadatos->BuscarEntidadbyDominio($idestructura);
            $arrIDsEntidades = array();
            foreach ($arrEntidades as $i => $v)
                $arrIDsEntidades[] = $v->idestructura;

            $sql = "( SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                dp.idsituacionpersona, nsp.denom as situacionpersona,
                dp.idsituacionespecificapersona,
                dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.idcargo IN (" . implode(',', $arrIDsCargos) . "))
			INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
			LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
			LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
			WHERE ";
            $sql .= $filtro . " ) UNION (";

            $sql .= "SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                dp.idsituacionpersona, nsp.denom as situacionpersona,
                dp.idsituacionespecificapersona,
                dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.identidad IN (" . implode(',', $arrIDsEntidades) . ")  AND doa.idcargo is null)
			INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
			LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
			LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
			WHERE ";
            $sql .= $filtro . " ) UNION ( ";
            //Busco todas las personas que adiciono el usuario y que todavia no ha puesto en el cargo
            $sql .= "select DISTINCT(dp1.idpersona), dp1.numid, dp1.nombre, dp1.snombre, dp1.papel, dp1.sapel, dp1.idsexo, dp1.idcategoriapersona,
			dp1.idsituacionpersona, nsp1.denom as situacionpersona,
			dp1.idsituacionespecificapersona,
			dpdi1.idpersonaidentidad, dpdi1.idtipodocidentidad, npc1.denom as categoriapersona, ntdi1.denom as tipodocidentidad
			from mod_persona.dat_persona dp1
			inner join mod_persona.dat_personadocidentidad dpdi1 on (dpdi1.idpersona = dp1.idpersona  and dpdi1.actual = 1 and dpdi1.activo = 1)
			inner join mod_persona.seg_personaaccesosindominio spasd1 on (spasd1.idpersonaacceso = dp1.idpersona and spasd1.idusuario = {$idusuario})
			left join mod_persona.nom_categoriapersona npc1 on (npc1.idcategoriapersona = dp1.idcategoriapersona)
			left join mod_persona.nom_tipodocidentidad ntdi1 on (ntdi1.idtipodocidentidad = dpdi1.idtipodocidentidad)
			left join mod_persona.nom_situacionpersona nsp1 on (nsp1.idsituacionpersona = dp1.idsituacionpersona)
			where  {$filtro1} ) ";

            $sql .= " order by nombre limit {$limite} offset {$inicio} ;";
            //die($sql);
            $resultado = $conn->fetchAll($sql);
        }//if($permiso == 2)
        else {
            $sql = "select DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
				dp.idsituacionpersona, nsp.denom as situacionpersona,
				dp.idsituacionespecificapersona,
				dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
				from mod_persona.dat_persona dp
				inner join mod_persona.dat_personadocidentidad dpdi on (dpdi.idpersona = dp.idpersona  and dpdi.actual = 1 and dpdi.activo = 1)
				left join mod_persona.dat_ocupacionactual doa on (doa.idpersona = dp.idpersona)
				left join mod_persona.nom_categoriapersona npc on (npc.idcategoriapersona = dp.idcategoriapersona)
				left join mod_persona.nom_tipodocidentidad ntdi on (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
				left join mod_persona.nom_situacionpersona nsp on (nsp.idsituacionpersona = dp.idsituacionpersona)
				where ";
            $sql .= $filtro . " ";
            $sql .= " order by dp.nombre limit {$limite} offset {$inicio} ;";
            //die($sql);
            $resultado = $conn->fetchAll($sql);
        }
        return $resultado;
    }

    public function countBuscarPersonaPorParamCC($params, $idestructura, $iddominio, $permiso, $meta)
    {
        $filtro = '';
        $filtro1 = '';
        if ($params->numid != "") {
            $filtro .= "dp.numid like '%" . $params->numid . "%' and ";
            $filtro1 .= "dp1.numid like '%" . $params->numid . "%' and ";
        }
        if ($params->nombre != "") {
            $filtro .= "lower(dp.nombre) like '%" . strtolower($params->nombre) . "%' and ";
            $filtro1 .= "lower(dp1.nombre) like '%" . strtolower($params->nombre) . "%' and ";
        }
        if ($params->snombre != "") {
            $filtro .= "lower(dp.snombre) like '%" . strtolower($params->snombre) . "%' and ";
            $filtro1 .= "lower(dp1.snombre) like '%" . strtolower($params->snombre) . "%' and ";
        }
        if ($params->primerapellido != "") {
            $filtro .= "lower(dp.papel) like '%" . strtolower($params->primerapellido) . "%' and ";
            $filtro1 .= "lower(dp1.papel) like '%" . strtolower($params->primerapellido) . "%' and ";
        }
        if ($params->segundoapellido != "") {
            $filtro .= "lower(dp.sapel) like '%" . strtolower($params->segundoapellido) . "%' and ";
            $filtro1 .= "lower(dp1.sapel) like '%" . strtolower($params->segundoapellido) . "%' and ";
        }
        if ($params->idpersona != "") {
            $filtro .= "dp.idpersona = '" . $params->idpersona . "' and ";
            $filtro1 .= "dp1.idpersona = '" . $params->idpersona . "' and ";
        }
        if ($params->idsexo != "") {
            $filtro .= "dp.idsexo = '" . $params->idsexo . "' and ";
            $filtro1 .= "dp1.idsexo = '" . $params->idsexo . "' and ";
        }
        if ($params->idcategoriapersona != "") {
            $filtro .= "dp.idcategoriapersona = '" . $params->idcategoriapersona . "' and ";
            $filtro1 .= "dp1.idcategoriapersona = '" . $params->idcategoriapersona . "' and ";
        }
        if ($params->tipoidentidad != "") {
            $filtro .= "dpdi.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
            $filtro1 .= "dpdi1.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
        }
        $in = "";
        if ($meta != null) {
            if ($params->tipoestructura == 1 or $params->tipoestructura == 2) {
                $arrEntidades = $meta->BuscarEntidadesXidestructura($params->idestructura);
                $in = "( ";
                $i = 0;
                foreach ($arrEntidades as $a) {
                    if ($i == 0)
                        $in = $in . $a['idestructura'];
                    else
                        $in = $in . ", " . $a['idestructura'];
                    $i++;
                }
                $in .= " )";

                $filtro .= "doa.identidad in {$in} and ";
            } else if ($params->tipoestructura == 3) {
                $filtro .= "doa.identidad = {$params->idestructura} and ";
            } else if ($params->tipoestructura == 4 or $params->tipoestructura == 5) {
                $filtro .= "doa.idcargo = {$params->idestructura} and ";
            } else if ($params->tipoestructura == 9 or $params->tipoestructura == 10) {
                $arrCargos = $meta->BuscarCargosXidestructuraop($params->idestructura);
                $in = "( ";
                $i = 0;
                foreach ($arrCargos as $a) {
                    if ($i == 0)
                        $in = $in . $a['idcargo'];
                    else
                        $in = $in . ", " . $a['idcargo'];
                    $i++;
                }
                $in .= " )";

                $filtro .= "doa.idcargo in {$in} and ";
            }
        }
        $filtro .= " dp.fechaeliminado is null";
        $filtro1 .= " dp1.fechaeliminado is null";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if ($permiso == 2) {
            $glob = ZendExt_GlobalConcept::getInstance();
            $idusuario = $glob->perfil->idusuario;
            $integratorIOC = ZendExt_IoC::getInstance();

            //Busco todos los cargos que el usuario logueado tiene acceso por dominio
            $arrCargos = $integratorIOC->metadatos->obtenerCargosEstructura($idestructura);
            $arrIDsCargos = array();
            foreach ($arrCargos as $i => $v)
                $arrIDsCargos[] = $v['idcargo'];

            //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
            $arrEntidades = $integratorIOC->metadatos->BuscarEntidadbyDominio($idestructura);
            $arrIDsEntidades = array();
            foreach ($arrEntidades as $i => $v)
                $arrIDsEntidades[] = $v->id;

            $sql = "( SELECT count(*) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.idcargo IN (" . implode(',', $arrIDsCargos) . "))
			INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
			LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
			LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
			WHERE ";
            $sql .= $filtro . " ) UNION (";

            $sql .= "SELECT count(*) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.identidad IN (" . implode(',', $arrIDsEntidades) . ")  AND doa.idcargo is null)
			INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
			LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
			LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
			WHERE ";
            $sql .= $filtro . " ) UNION ( ";
            //Busco todas las personas que adiciono el usuario y que todavia no ha puesto en el cargo
            $sql .= "select count(*) as cantidad
			from mod_persona.dat_persona dp1
			inner join mod_persona.dat_personadocidentidad dpdi1 on (dpdi1.idpersona = dp1.idpersona  and dpdi1.actual = 1 and dpdi1.activo = 1)
			inner join mod_persona.seg_personaaccesosindominio spasd1 on (spasd1.idpersonaacceso = dp1.idpersona and spasd1.idusuario = {$idusuario})
			left join mod_persona.nom_categoriapersona npc1 on (npc1.idcategoriapersona = dp1.idcategoriapersona)
			left join mod_persona.nom_tipodocidentidad ntdi1 on (ntdi1.idtipodocidentidad = dpdi1.idtipodocidentidad)
			left join mod_persona.nom_situacionpersona nsp1 on (nsp1.idsituacionpersona = dp1.idsituacionpersona)
			where  {$filtro1} ) ";

            //die($sql);
            $resultado = $conn->fetchAll($sql);
            return $resultado[0]['cantidad'] + $resultado[1]['cantidad'] + $resultado[2]['cantidad'];
        }//if($permiso == 2)
        else {
            $sql = "select count(*) as cantidad
			from mod_persona.dat_persona dp
			inner join mod_persona.dat_personadocidentidad dpdi on (dpdi.idpersona = dp.idpersona  and dpdi.actual = 1 and dpdi.activo = 1)
			left join mod_persona.dat_ocupacionactual doa on (doa.idpersona = dp.idpersona)
			left join mod_persona.nom_categoriapersona npc on (npc.idcategoriapersona = dp.idcategoriapersona)
			left join mod_persona.nom_tipodocidentidad ntdi on (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			left join mod_persona.nom_situacionpersona nsp on (nsp.idsituacionpersona = dp.idsituacionpersona)
			where ";
            $sql .= $filtro . " ";
            //die($sql);
            $resultado = $conn->fetchAll($sql);
            return $resultado[0]['cantidad'];
        }
        return 0;
    }

    public function BuscadorCC($inicio = 0, $limite = 20, $texto, $idestructura, $iddominio, $permiso)
    {
        $where = '';
        $where1 = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.numid ilike '%$arreglo[$i]%' or dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                    $where1 .= $or . " dp1.numid ilike '%$arreglo[$i]%' or dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%' ";
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        if ($where != '')
            $where1 = '( ' . $where1 . ' )';
        $where .= ($where != '') ? ' and (dp.fechaeliminado is null and df.hasta is null)' : ' dp.fechaeliminado is null and df.hasta is null';
        $where1 .= ($where1 != '') ? ' and (dp1.fechaeliminado is null and df1.hasta is null)' : ' dp1.fechaeliminado is null and df1.hasta is null';
        //die($where);
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if ($permiso == 2) {
            $glob = ZendExt_GlobalConcept::getInstance();
            $idusuario = $glob->perfil->idusuario;
            $integratorIOC = ZendExt_IoC::getInstance();

            //Busco todos los cargos que el usuario logueado tiene acceso por dominio
            $arrCargos = $integratorIOC->metadatos->obtenerCargosEstructura($idestructura);
            $arrIDsCargos = array();
            foreach ($arrCargos as $i => $v)
                $arrIDsCargos[] = $v['idcargo'];

            //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
            $arrEntidades = $integratorIOC->metadatos->BuscarEntidadbyDominio($idestructura);
            $arrIDsEntidades = array();
            foreach ($arrEntidades as $i => $v)
                $arrIDsEntidades[] = $v->id;

            $sql = "( SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
					dp.idsituacionpersona, nsp.denom as situacionpersona,
					dp.idsituacionespecificapersona,
					dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, df.idfoto, df.extension, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
				FROM mod_persona.dat_persona dp
				INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.idcargo IN (" . implode(',', $arrIDsCargos) . "))
				INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
				LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
				LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
				LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
				LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
				WHERE ";
            $sql .= $where . " ) UNION (";

            $sql .= "SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
					dp.idsituacionpersona, nsp.denom as situacionpersona,
					dp.idsituacionespecificapersona,
					dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, df.idfoto, df.extension, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
				FROM mod_persona.dat_persona dp
				INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.identidad IN (" . implode(',', $arrIDsEntidades) . ")  AND doa.idcargo is null)
				INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
				LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
				LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
				LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
				LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
				WHERE ";
            $sql .= $where . " ) UNION ( ";
            //Busco todas las personas que adiciono el usuario y que todavia no ha puesto en el cargo
            $sql .= "select DISTINCT(dp1.idpersona), dp1.numid, dp1.nombre, dp1.snombre, dp1.papel, dp1.sapel, dp1.idsexo, dp1.idcategoriapersona,
				dp1.idsituacionpersona, nsp1.denom as situacionpersona,
				dp1.idsituacionespecificapersona,
				dpdi1.idpersonaidentidad, dpdi1.idtipodocidentidad, df1.idfoto, df1.extension, npc1.denom as categoriapersona, ntdi1.denom as tipodocidentidad
				from mod_persona.dat_persona dp1
				inner join mod_persona.dat_personadocidentidad dpdi1 on (dpdi1.idpersona = dp1.idpersona  and dpdi1.actual = 1 and dpdi1.activo = 1)
				inner join mod_persona.seg_personaaccesosindominio spasd1 on (spasd1.idpersonaacceso = dp1.idpersona and spasd1.idusuario = {$idusuario})
				left join mod_persona.nom_categoriapersona npc1 on (npc1.idcategoriapersona = dp1.idcategoriapersona)
				left join mod_persona.nom_tipodocidentidad ntdi1 on (ntdi1.idtipodocidentidad = dpdi1.idtipodocidentidad)
				left join mod_persona.nom_situacionpersona nsp1 on (nsp1.idsituacionpersona = dp1.idsituacionpersona)
				left join mod_persona.dat_foto df1 on (df1.idpersona = dp1.idpersona)
				where  {$where1} )";
            $sql .= " order by nombre limit {$limite} offset {$inicio} ;";
            //die($sql);
            $resultado = $conn->fetchAll($sql);
        }//if($permiso == 2)
        else if ($permiso == 1) {
            $sql = "SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                    dp.idsituacionpersona, nsp.denom as situacionpersona,
                    dp.idsituacionespecificapersona,
                    dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
            FROM mod_persona.dat_persona dp
            INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
            LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
            LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
            LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
            LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
            WHERE " . $where;
            $sql .= " order by nombre limit {$limite} offset {$inicio} ;";
            $resultado = $conn->fetchAll($sql);
            //die($sql);
        } else
            $resultado = array();
        return $resultado;
    }

    public function BuscarPersonaTextoSubConjunto($inicio = 0, $limite = 20, $texto, $idestructura, $permiso, $arrPersonas)
    {
        $where = '';
        $where1 = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.numid ilike '%$arreglo[$i]%' or dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                    $where1 .= $or . " dp1.numid ilike '%$arreglo[$i]%' or dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%' ";
                }
            }
        }
        if ($where != '') {
            $where = '( ' . $where . ' ) and dp.idpersona in (' . implode(',', $arrPersonas) . ')';
        } else {
            $where = ' dp.idpersona in (' . implode(',', $arrPersonas) . ')';
        }
        if ($where1 != '') {
            $where1 = '( ' . $where1 . ' ) and dp1.idpersona in (' . implode(',', $arrPersonas) . ')';
        } else {
            $where1 = ' dp1.idpersona in (' . implode(',', $arrPersonas) . ')';
        }
        $where .= ($where != '') ? ' and (dp.fechaeliminado is null and df.hasta is null)' : ' dp.fechaeliminado is null and df.hasta is null';
        $where1 .= ($where1 != '') ? ' and (dp1.fechaeliminado is null and df1.hasta is null)' : ' dp1.fechaeliminado is null and df1.hasta is null';
        //die($where);
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if ($permiso == 2) {
            $glob = ZendExt_GlobalConcept::getInstance();
            $idusuario = $glob->perfil->idusuario;
            $integratorIOC = ZendExt_IoC::getInstance();

            //Busco todos los cargos que el usuario logueado tiene acceso por dominio
            $arrCargos = $integratorIOC->metadatos->BuscarCargosXIdestructuraConDominio($idestructura);
            $arrIDsCargos = array();
            foreach ($arrCargos as $i => $v)
                $arrIDsCargos[] = $v['idcargo'];

            //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
            $arrEntidades = $integratorIOC->metadatos->BuscarEntidadesXidestructura($idestructura);
            $arrIDsEntidades = array();
            foreach ($arrEntidades as $i => $v)
                $arrIDsEntidades[] = $v['idestructura'];

            $sql = "( SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                dp.idsituacionpersona, nsp.denom as situacionpersona,
                dp.idsituacionespecificapersona,
                dpdi.idpersonaidentidad, dpdi.serie,dpdi.idtipodocidentidad, df.idfoto, df.extension, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.idcargo IN (" . implode(',', $arrIDsCargos) . "))
			INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
			LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
			LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
			LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
			WHERE ";
            $sql .= $where . " ) UNION (";

            $sql .= "SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                dp.idsituacionpersona, nsp.denom as situacionpersona,
                dp.idsituacionespecificapersona,
                dpdi.idpersonaidentidad, dpdi.serie,dpdi.idtipodocidentidad, df.idfoto, df.extension, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.identidad IN (" . implode(',', $arrIDsEntidades) . ")  AND doa.idcargo is null)
			INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
			LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
			LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
			LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
			WHERE ";
            $sql .= $where . " ) UNION ( ";
            //Busco todas las personas que adiciono el usuario y que todavia no ha puesto en el cargo
            $sql .= "select DISTINCT(dp1.idpersona), dp1.numid, dp1.nombre, dp1.snombre, dp1.papel, dp1.sapel, dp1.idsexo, dp1.idcategoriapersona,
			dp1.idsituacionpersona, nsp1.denom as situacionpersona,
			dp1.idsituacionespecificapersona,
			dpdi1.idpersonaidentidad, dpdi1.serie,dpdi1.idtipodocidentidad, df1.idfoto, df1.extension, npc1.denom as categoriapersona, ntdi1.denom as tipodocidentidad
			from mod_persona.dat_persona dp1
			inner join mod_persona.dat_personadocidentidad dpdi1 on (dpdi1.idpersona = dp1.idpersona  and dpdi1.actual = 1 and dpdi1.activo = 1)
			inner join mod_persona.seg_personaaccesosindominio spasd1 on (spasd1.idpersonaacceso = dp1.idpersona and spasd1.idusuario = {$idusuario})
			left join mod_persona.nom_categoriapersona npc1 on (npc1.idcategoriapersona = dp1.idcategoriapersona)
			left join mod_persona.nom_tipodocidentidad ntdi1 on (ntdi1.idtipodocidentidad = dpdi1.idtipodocidentidad)
			left join mod_persona.nom_situacionpersona nsp1 on (nsp1.idsituacionpersona = dp1.idsituacionpersona)
			left join mod_persona.dat_foto df1 on (df1.idpersona = dp1.idpersona and df.activo = 1)
			where  {$where1} )";
            $sql .= " order by nombre limit {$limite} offset {$inicio} ;";
            //die($sql);
            $resultado = $conn->fetchAll($sql);
        }//if($permiso == 2)
        else if ($permiso == 1) {
            $sql = "SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                dp.idsituacionpersona, nsp.denom as situacionpersona,
                dp.idsituacionespecificapersona,
                dpdi.idpersonaidentidad, dpdi.serie,dpdi.idtipodocidentidad, df.idfoto, df.extension, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
			LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
			LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
			LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
			WHERE " . $where;
            $sql .= " order by nombre limit {$limite} offset {$inicio} ;";
            $resultado = $conn->fetchAll($sql);
            //die($sql);
        } else
            $resultado = array();
        return $resultado;
    }

    public function countBuscarPersonaTextoSubConjunto($texto, $idestructura, $permiso, $arrPersonas)
    {
        $where = '';
        $where1 = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.numid ilike '%$arreglo[$i]%' or dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                    $where1 .= $or . " dp1.numid ilike '%$arreglo[$i]%' or dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%' ";
                }
            }
        }
        if ($where != '') {
            $where = '( ' . $where . ' ) and dp.idpersona in (' . implode(',', $arrPersonas) . ')';
        } else {
            $where = ' dp.idpersona in (' . implode(',', $arrPersonas) . ')';
        }
        if ($where1 != '') {
            $where1 = '( ' . $where1 . ' ) and dp1.idpersona in (' . implode(',', $arrPersonas) . ')';
        } else {
            $where1 = ' dp1.idpersona in (' . implode(',', $arrPersonas) . ')';
        }
        $where .= ($where != '') ? ' and (dp.fechaeliminado is null and df.hasta is null)' : ' dp.fechaeliminado is null and df.hasta is null';
        $where1 .= ($where1 != '') ? ' and (dp1.fechaeliminado is null and df1.hasta is null)' : ' dp1.fechaeliminado is null and df1.hasta is null';

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if ($permiso == 2) {
            $glob = ZendExt_GlobalConcept::getInstance();
            $idusuario = $glob->perfil->idusuario;
            $integratorIOC = ZendExt_IoC::getInstance();

            //Busco todos los cargos que el usuario logueado tiene acceso por dominio
            $arrCargos = $integratorIOC->metadatos->BuscarCargosXIdestructuraConDominio($idestructura);
            $arrIDsCargos = array();
            foreach ($arrCargos as $i => $v)
                $arrIDsCargos[] = $v['idcargo'];

            //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
            $arrEntidades = $integratorIOC->metadatos->BuscarEntidadesXidestructura($idestructura);
            $arrIDsEntidades = array();
            foreach ($arrEntidades as $i => $v)
                $arrIDsEntidades[] = $v['idestructura'];

            $sql = "( SELECT count(*) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.idcargo IN (" . implode(',', $arrIDsCargos) . "))
			INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
			LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
			LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
			LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
			WHERE ";
            $sql .= $where . " ) UNION (";

            $sql .= "SELECT count(*) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.identidad IN (" . implode(',', $arrIDsEntidades) . ")  AND doa.idcargo is null)
			INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
			LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
			LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
			LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
			WHERE ";
            $sql .= $where . " ) UNION ( ";
            //Busco todas las personas que adiciono el usuario y que todavia no ha puesto en el cargo
            $sql .= "select count(*) as cantidad
			from mod_persona.dat_persona dp1
			inner join mod_persona.dat_personadocidentidad dpdi1 on (dpdi1.idpersona = dp1.idpersona  and dpdi1.actual = 1 and dpdi1.activo = 1)
			inner join mod_persona.seg_personaaccesosindominio spasd1 on (spasd1.idpersonaacceso = dp1.idpersona and spasd1.idusuario = {$idusuario})
			left join mod_persona.nom_categoriapersona npc1 on (npc1.idcategoriapersona = dp1.idcategoriapersona)
			left join mod_persona.nom_tipodocidentidad ntdi1 on (ntdi1.idtipodocidentidad = dpdi1.idtipodocidentidad)
			left join mod_persona.nom_situacionpersona nsp1 on (nsp1.idsituacionpersona = dp1.idsituacionpersona)
			left join mod_persona.dat_foto df1 on (df1.idpersona = dp1.idpersona and df.activo = 1)
			where  {$where1} )";
            $result = $conn->fetchAll($sql);
            $resultado = $result[0]['cantidad'] + $result[1]['cantidad'] + $result[2]['cantidad'];
        }//if($permiso == 2)
        else if ($permiso == 1) {
            $sql = "SELECT count(*) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
			LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
			LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
			LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
			WHERE " . $where;
            $result = $conn->fetchAll($sql);

            if (count($result) > 0)
                $resultado = $result[0]['cantidad'];
            else
                $resultado = 0;
        } else
            $resultado = 0;
        return $resultado;
    }

    public function BuscarPersonaPorParamCategoria($params, $limite, $inicio, $meta, $distinto)
    {

        $filtro = '';
        $filtro1 = '';
        if ($params->numid != "") {
            $filtro .= "dp.numid like '%" . $params->numid . "%' and ";
            $filtro1 .= "dp1.numid like '%" . $params->numid . "%' and ";
        }
        if ($params->nombre != "") {
            $filtro .= "lower(dp.nombre) like '%" . strtolower($params->nombre) . "%' and ";
            $filtro1 .= "lower(dp1.nombre) like '%" . strtolower($params->nombre) . "%' and ";
        }
        if ($params->snombre != "") {
            $filtro .= "lower(dp.snombre) like '%" . strtolower($params->snombre) . "%' and ";
            $filtro1 .= "lower(dp1.snombre) like '%" . strtolower($params->snombre) . "%' and ";
        }
        if ($params->primerapellido != "") {
            $filtro .= "lower(dp.papel) like '%" . strtolower($params->primerapellido) . "%' and ";
            $filtro1 .= "lower(dp1.papel) like '%" . strtolower($params->primerapellido) . "%' and ";
        }
        if ($params->segundoapellido != "") {
            $filtro .= "lower(dp.sapel) like '%" . strtolower($params->segundoapellido) . "%' and ";
            $filtro1 .= "lower(dp1.sapel) like '%" . strtolower($params->segundoapellido) . "%' and ";
        }
        if ($params->idpersona != "") {
            $filtro .= "dp.idpersona = '" . $params->idpersona . "' and ";
            $filtro1 .= "dp1.idpersona = '" . $params->idpersona . "' and ";
        }
        if ($params->idsexo != "") {
            $filtro .= "dp.idsexo = '" . $params->idsexo . "' and ";
            $filtro1 .= "dp1.idsexo = '" . $params->idsexo . "' and ";
        }
        if ($params->idcategoriapersona != "") {
            $filtro .= "dp.idcategoriapersona = '" . $params->idcategoriapersona . "' and ";
            $filtro1 .= "dp1.idcategoriapersona = '" . $params->idcategoriapersona . "' and ";
        }
        if ($params->tipoidentidad != "") {
            $filtro .= "dpdi.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
            $filtro1 .= "dpdi1.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
        }
        if ($params->noserie != "") {
            $filtro .= "dpdi.serie = '" . $params->noserie . "' and ";
            $filtro1 .= "dpdi1.serie = '" . $params->noserie . "' and ";
        }
        $in = "";
        if ($meta != null) {
            if ($params->tipoestructura == 1 or $params->tipoestructura == 2) {
                $arrEntidades = $meta->BuscarEntidadesXidestructura($params->idestructura);
                $in = "( ";
                $i = 0;
                foreach ($arrEntidades as $a) {
                    if ($i == 0)
                        $in = $in . $a['idestructura'];
                    else
                        $in = $in . ", " . $a['idestructura'];
                    $i++;
                }
                $in .= " )";

                $filtro .= "doa.identidad in {$in} and ";
            } else if ($params->tipoestructura == 3) {
                $filtro .= "doa.identidad = {$params->idestructura} and ";
            } else if ($params->tipoestructura == 4 or $params->tipoestructura == 5) {
                $filtro .= "doa.idcargo = {$params->idestructura} and ";
            } else if ($params->tipoestructura == 9 or $params->tipoestructura == 10) {
                $arrCargos = $meta->BuscarCargosXidestructuraop($params->idestructura);
                $in = "( ";
                $i = 0;
                foreach ($arrCargos as $a) {
                    if ($i == 0)
                        $in = $in . $a['idcargo'];
                    else
                        $in = $in . ", " . $a['idcargo'];
                    $i++;
                }
                $in .= " )";

                $filtro .= "doa.idcargo in {$in} and ";
            }
        }
        $in = 'not in';
        if ($distinto != 1)
            $in = 'in';
        if ($filtro != '')
            $filtro = ' ( ' . $filtro . ' )  and npc.idcategoriapersona ' . $in . ' (' . implode(',', $arridcategoriapersona) . ') ';
        else
            $filtro = ' npc.idcategoriapersona ' . $in . ' (' . implode(',', $arridcategoriapersona) . ') ';

        $filtro .= " dp.fechaeliminado is null";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $glob = ZendExt_GlobalConcept::getInstance();
        $idusuario = $glob->perfil->idusuario;
        $integratorIOC = ZendExt_IoC::getInstance();

        /*  $iddominio = $glob->perfil->iddominio;
          //Busco todos los cargos que el usuario logueado tiene acceso por dominio
          $arrCargos = $integratorIOC->metadatos->BuscarTodoEAVPorTipoyDominio(array('0'=> 4,'1'=> 5),$iddominio);
          foreach ($arrCargos as $i => $v)
          $arrIDsCargos[] = $v['idfila'];


          //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
          $arrEntidades = $integratorIOC->metadatos->BuscarTodoEAVPorTipoyDominio(array('0'=> 3),$iddominio);
          foreach ($arrEntidades as $i => $v)
          $arrIDsEntidades[] = $v['idfila'];
         */

        $sql .= "SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                dp.idsituacionpersona, nsp.denom as situacionpersona,
                dp.idsituacionespecificapersona,
                dpdi.idpersonaidentidad, dpdi.serie,dpdi.idtipodocidentidad, df.idfoto, df.extension, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.identidad IN (" . implode(',', $arrIDsEntidades) . ")  AND doa.idcargo is null)
			INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
			LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
			LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
			LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
			WHERE ";
        $sql .= $filtro;
        $sql .= " order by nombre limit {$limite} offset {$inicio} ;";
        $resultado = $conn->fetchAll($sql);

        if ($resultado)
            return $resultado;
        else
            return array();
    }

    public function countBuscarPersonaPorParamCategoria($params, $meta, $distinto)
    {
        $filtro = '';
        $filtro1 = '';
        if ($params->numid != "") {
            $filtro .= "dp.numid like '%" . $params->numid . "%' and ";
            $filtro1 .= "dp1.numid like '%" . $params->numid . "%' and ";
        }
        if ($params->nombre != "") {
            $filtro .= "lower(dp.nombre) like '%" . strtolower($params->nombre) . "%' and ";
            $filtro1 .= "lower(dp1.nombre) like '%" . strtolower($params->nombre) . "%' and ";
        }
        if ($params->snombre != "") {
            $filtro .= "lower(dp.snombre) like '%" . strtolower($params->snombre) . "%' and ";
            $filtro1 .= "lower(dp1.snombre) like '%" . strtolower($params->snombre) . "%' and ";
        }
        if ($params->primerapellido != "") {
            $filtro .= "lower(dp.papel) like '%" . strtolower($params->primerapellido) . "%' and ";
            $filtro1 .= "lower(dp1.papel) like '%" . strtolower($params->primerapellido) . "%' and ";
        }
        if ($params->segundoapellido != "") {
            $filtro .= "lower(dp.sapel) like '%" . strtolower($params->segundoapellido) . "%' and ";
            $filtro1 .= "lower(dp1.sapel) like '%" . strtolower($params->segundoapellido) . "%' and ";
        }
        if ($params->idpersona != "") {
            $filtro .= "dp.idpersona = '" . $params->idpersona . "' and ";
            $filtro1 .= "dp1.idpersona = '" . $params->idpersona . "' and ";
        }
        if ($params->idsexo != "") {
            $filtro .= "dp.idsexo = '" . $params->idsexo . "' and ";
            $filtro1 .= "dp1.idsexo = '" . $params->idsexo . "' and ";
        }
        if ($params->idcategoriapersona != "") {
            $filtro .= "dp.idcategoriapersona = '" . $params->idcategoriapersona . "' and ";
            $filtro1 .= "dp1.idcategoriapersona = '" . $params->idcategoriapersona . "' and ";
        }
        if ($params->tipoidentidad != "") {
            $filtro .= "dpdi.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
            $filtro1 .= "dpdi1.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
        }
        if ($params->noserie != "") {
            $filtro .= "dpdi.serie = '" . $params->noserie . "' and ";
            $filtro1 .= "dpdi1.serie = '" . $params->noserie . "' and ";
        }

        $in = "";
        if ($meta != null) {
            if ($params->tipoestructura == 1 or $params->tipoestructura == 2) {
                $arrEntidades = $meta->BuscarEntidadesXidestructura($params->idestructura);
                $in = "( ";
                $i = 0;
                foreach ($arrEntidades as $a) {
                    if ($i == 0)
                        $in = $in . $a['idestructura'];
                    else
                        $in = $in . ", " . $a['idestructura'];
                    $i++;
                }
                $in .= " )";

                $filtro .= "doa.identidad in {$in} and ";
            } else if ($params->tipoestructura == 3) {
                $filtro .= "doa.identidad = {$params->idestructura} and ";
            } else if ($params->tipoestructura == 4 or $params->tipoestructura == 5) {
                $filtro .= "doa.idcargo = {$params->idestructura} and ";
            } else if ($params->tipoestructura == 9 or $params->tipoestructura == 10) {
                $arrCargos = $meta->BuscarCargosXidestructuraop($params->idestructura);
                $in = "( ";
                $i = 0;
                foreach ($arrCargos as $a) {
                    if ($i == 0)
                        $in = $in . $a['idcargo'];
                    else
                        $in = $in . ", " . $a['idcargo'];
                    $i++;
                }
                $in .= " )";

                $filtro .= "doa.idcargo in {$in} and ";
            }
        }
        $in = 'not in';
        if ($distinto != 1)
            $in = 'in';
        if ($filtro != '')
            $filtro = ' ( ' . $filtro . ' )  and npc.idcategoriapersona ' . $in . ' (' . implode(',', $arridcategoriapersona) . ') ';
        else
            $filtro = ' npc.idcategoriapersona ' . $in . ' (' . implode(',', $arridcategoriapersona) . ') ';

        $filtro .= " dp.fechaeliminado is null";


        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $glob = ZendExt_GlobalConcept::getInstance();
        $idusuario = $glob->perfil->idusuario;
        $integratorIOC = ZendExt_IoC::getInstance();

        $iddominio = $glob->perfil->iddominio;
        //Busco todos los cargos que el usuario logueado tiene acceso por dominio
        $arrCargos = $integratorIOC->metadatos->BuscarTodoEAVPorTipoyDominio(array('0' => 4, '1' => 5), $iddominio);
        foreach ($arrCargos as $i => $v)
            $arrIDsCargos[] = $v['idfila'];


        //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
        $arrEntidades = $integratorIOC->metadatos->BuscarTodoEAVPorTipoyDominio(array('0' => 3), $iddominio);
        foreach ($arrEntidades as $i => $v)
            $arrIDsEntidades[] = $v['idfila'];


        $sql .= " SELECT count(*) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.identidad IN (" . implode(',', $arrIDsEntidades) . ")  AND doa.idcargo is null)
			INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
			LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
			LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
			LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
			LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
			WHERE ";
        $sql .= $filtro;
        $resultado = $conn->fetchAll($sql);
        return $resultado[0]['cantidad'] + $resultado[1]['cantidad'] + $resultado[2]['cantidad'];
    }

    public function ObtenerDatosPersona($idpersona)
    {

        $sql = "select dp.idpersona,encode(df.foto, 'escape') AS foto,dp.sexo,(CASE WHEN dp.snombre is null THEN (dp.nombre ||' '||dp.papel ||' '||dp.sapel) ELSE (dp.nombre ||' '||dp.snombre||' '||dp.papel ||' '||dp.sapel) END ) as nombreapellidos, docid.numero as numid, dp.sexo
                from mod_persona.dat_persona dp
                left join mod_persona.dat_docidentidad docid on (docid.idpersona = dp.idpersona and docid.principal = 1)
                left join mod_persona.dat_foto df on (df.idpersona = dp.idpersona)
                where dp.idpersona = {$idpersona}";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function BuscarPersonaPorParamNomina($params, $limite, $inicio, $idestructura, $iddominio, $permiso, $meta, $campocolores)
    {
        $filtro = '';
        //print_r($params);die;
        if ($params->numid != "") {
            $filtro .= "dpdi.numero ilike '%" . $params->numid . "%' and ";
        }
        if ($params->nombre != "") {
            $filtro .= "lower(dp.nombre) ilike '%" . strtolower($params->nombre) . "%' and ";
        }
        if ($params->snombre != "") {
            $filtro .= "lower(dp.snombre) ilike '%" . strtolower($params->snombre) . "%' and ";
        }
        if ($params->primerapellido != "") {
            $filtro .= "lower(dp.papel) ilike '%" . strtolower($params->primerapellido) . "%' and ";
        }
        if ($params->segundoapellido != "") {
            $filtro .= "lower(dp.sapel) ilike '%" . strtolower($params->segundoapellido) . "%' and ";
        }
        if ($params->idpersona != "") {
            $filtro .= "dp.idpersona = '" . $params->idpersona . "' and ";
        }
        if ($params->idsexo != "") {
            $filtro .= "dp.idsexo = '" . $params->idsexo . "' and ";
        }
        if ($params->idcategoriapersona != "") {
            $filtro .= "dc.idcategoria = '" . $params->idcategoriapersona . "' and ";
        }
        if ($params->tipoidentidad != "") {
            $filtro .= "dpdi.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
        }
        if (!empty($params->arrayidplantillas)) {
            $filtro .= "cpn.idplantillanominal in(" . implode(',', $params->arrayidplantillas) . ") and ";
        }

        //arrayidplantillas
        $filtro .= " dp.feliminado is null";

        /*
        $integratorIOC = ZendExt_IoC::getInstance();
        //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
        //$arrEntidades = $integratorIOC->metadatos->BuscarEntidadesXidestructura($identidad);
        $arrIDsEntidades = array($idestructura);
        //$arrIDsEntidades = array();
        //foreach ($arrEntidades as $i => $v)
            //$arrIDsEntidades[] = $v['idestructura'];

        $sql .= "SELECT DISTINCT(dp.idpersona), dpdi.numero as numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, nc.idcategoria,
		         nc.denominacion as categoriapersona " . ($campocolores ? ", dco." . $campocolores : "") . "
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona  = dp.idpersona AND dco.identidad IN (" . implode(',', $arrIDsEntidades) . ") AND (dco.fechavencimiento is null or dco.fechavencimiento >= now()))
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.dat_categorizacion dc ON (dc.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoria nc ON (nc.idcategoria = dc.idcategoria)
			WHERE ";
        */

        $sql .= "SELECT DISTINCT(dp.idpersona), dpdi.numero as numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, nc.idcategoria, 
                (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
                ((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
		         nc.denominacion as categoriapersona " . ($campocolores ? ", dco." . $campocolores : "") . "
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona and dco.identidad = " . $idestructura . ")
            LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
            LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $idestructura . ")
			
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.dat_categorizacion dc ON (dc.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoria nc ON (nc.idcategoria = dc.idcategoria)
			WHERE ";

        $sql .= $filtro . " ";
        $sql .= " order by nombre limit {$limite} offset {$inicio} ;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function countBuscarPersonaPorParamNomina($params, $idestructura, $iddominio, $permiso, $meta)
    {
        $filtro = '';
        if ($params->numid != "") {
            $filtro .= "dpdi.numero ilike '%" . $params->numid . "%' and ";
        }
        if ($params->nombre != "") {
            $filtro .= "lower(dp.nombre) ilike '%" . strtolower($params->nombre) . "%' and ";
        }
        if ($params->snombre != "") {
            $filtro .= "lower(dp.snombre) ilike '%" . strtolower($params->snombre) . "%' and ";
        }
        if ($params->primerapellido != "") {
            $filtro .= "lower(dp.papel) ilike '%" . strtolower($params->primerapellido) . "%' and ";
        }
        if ($params->segundoapellido != "") {
            $filtro .= "lower(dp.sapel) ilike '%" . strtolower($params->segundoapellido) . "%' and ";
        }
        if ($params->idpersona != "") {
            $filtro .= "dp.idpersona = '" . $params->idpersona . "' and ";
        }
        if ($params->idsexo != "") {
            $filtro .= "dp.idsexo = '" . $params->idsexo . "' and ";
        }
        if ($params->idcategoriapersona != "") {
            $filtro .= "dc.idcategoria = '" . $params->idcategoriapersona . "' and ";
        }
        if ($params->tipoidentidad != "") {
            $filtro .= "dpdi.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
        }
        if (!empty($params->arrayidplantillas)) {
            $filtro .= "cpn.idplantillanominal in(" . implode(',', $params->arrayidplantillas) . ") and ";
        }

        $filtro .= " dp.feliminado is null";

        /*
        $integratorIOC = ZendExt_IoC::getInstance();
        //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
        //$arrEntidades = $integratorIOC->metadatos->BuscarEntidadesXidestructura($identidad);
        $arrIDsEntidades = array($idestructura);
        //$arrIDsEntidades = array();
        //foreach ($arrEntidades as $i => $v)
            //$arrIDsEntidades[] = $v['idestructura'];

        $sql .= "SELECT count(dp.idpersona) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona  = dp.idpersona AND dco.identidad IN (" . implode(',', $arrIDsEntidades) . ") AND (dco.fechavencimiento is null or dco.fechavencimiento >= now()))
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.dat_categorizacion dc ON (dc.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoria nc ON (nc.idcategoria = dc.idcategoria)
			WHERE ";
        */

        $sql .= "SELECT count(dp.idpersona) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona and dco.identidad = " . $idestructura . ")
            LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
            LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $idestructura . ")
			
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.dat_categorizacion dc ON (dc.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoria nc ON (nc.idcategoria = dc.idcategoria)
			WHERE ";

        $sql .= $filtro . ";";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($sql);
        return $resultado[0]['cantidad'];
    }

    public function BuscarPersonaNominaPorEntidadParams($params, $inicio, $limite, $identidad, $arraycategorias = null)
    {
        if ($arraycategorias->cliente == 'MINFAR')
        {
            $filtro = '';
        if ($params->numid != "") {
            $filtro .= "dpdi.numero ilike '%" . $params->numid . "%' and ";
        }
        if ($params->nombre != "") {
            $filtro .= "lower(dp.nombre) ilike '%" . strtolower($params->nombre) . "%' and ";
        }
        if ($params->snombre != "") {
            $filtro .= "lower(dp.snombre) ilike '%" . strtolower($params->snombre) . "%' and ";
        }
        if ($params->primerapellido != "") {
            $filtro .= "lower(dp.papel) ilike '%" . strtolower($params->primerapellido) . "%' and ";
        }
        if ($params->segundoapellido != "") {
            $filtro .= "lower(dp.sapel) ilike '%" . strtolower($params->segundoapellido) . "%' and ";
        }
        if ($params->idpersona != "") {
            $filtro .= "dp.idpersona = '" . $params->idpersona . "' and ";
        }
        if ($params->idcategoriapersona != "") {
            $filtro .= "npc.idcategoriapersona = '" . $params->idcategoriapersona . "' and ";
        }
        if ($params->numerocuenta != "") {
            $filtro .= "dcb.numerocuenta ilike '%" . $params->numerocuenta . "%' and ";
        }
        if ($params->grado != "") {
            $filtro .= "lower(ng.denominacion) ilike '%" . strtolower($params->grado) . "%' and ";
        }

        $filtro .= " dp.feliminado is null";

        $integratorIOC = ZendExt_IoC::getInstance();
        //print_r($params->arrayidplantillas);die;
        if (count($params->arrayidplantillas) > 0) {
            $filtro .= ($filtro != '') ? ' and cpn.idplantillanominal in(' . implode(',', $params->arrayidplantillas) . ')' : 'cpn.idplantillanominal in(' . implode(',', $params->arrayidplantillas) . ')';
        }
        $sql .= "SELECT DISTINCT(dp.idpersona), dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo, dpcat.idcategoria, dco.idcargosocupados,
                    (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                    (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
					((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                    npc.denominacion as categoriapersona, drp.idretencionpersona
            FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
            LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
            LEFT JOIN mod_personaext.dat_gradomilitar dg on (dg.idpersona = dp.idpersona and dg.fhasta is null)
            LEFT JOIN mod_estructuracomp.nom_grado ng on (ng.idgrado = dg.idgradomilitar)
			INNER JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
            INNER JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
            LEFT JOIN mod_personaext.dat_cuentabancaria dcb ON (dcb.idpersona = dp.idpersona)
			LEFT JOIN mod_nomina.dat_retencionpersona drp ON (drp.idpersona = dp.idpersona and drp.identidad = " . $identidad . ")
            WHERE ";
        $sql .= $filtro . " ";   
              
        }

        else {
            $filtro = '';
        if ($params->numid != "") {
            $filtro .= "dpdi.numero ilike '%" . $params->numid . "%' and ";
        }
        if ($params->nombre != "") {
            $filtro .= "lower(dp.nombre) ilike '%" . strtolower($params->nombre) . "%' and ";
        }
        if ($params->snombre != "") {
            $filtro .= "lower(dp.snombre) ilike '%" . strtolower($params->snombre) . "%' and ";
        }
        if ($params->primerapellido != "") {
            $filtro .= "lower(dp.papel) ilike '%" . strtolower($params->primerapellido) . "%' and ";
        }
        if ($params->segundoapellido != "") {
            $filtro .= "lower(dp.sapel) ilike '%" . strtolower($params->segundoapellido) . "%' and ";
        }
        if ($params->idpersona != "") {
            $filtro .= "dp.idpersona = '" . $params->idpersona . "' and ";
        }
        if ($params->idsexo != "") {
            $filtro .= "dp.idsexo = '" . $params->idsexo . "' and ";
        }
        if ($params->idcategoriapersona != "") {
            $filtro .= "dc.idcategoria = '" . $params->idcategoriapersona . "' and ";
        }
        if ($params->tipoidentidad != "") {
            $filtro .= "dpdi.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
        }

        $filtro .= " dp.feliminado is null";

        $integratorIOC = ZendExt_IoC::getInstance();
        //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
        //$arrEntidades = $integratorIOC->metadatos->BuscarEntidadesXidestructura($identidad);
        $arrIDsEntidades = array($identidad);
        /* $arrIDsEntidades = array();
          foreach ($arrEntidades as $i => $v)
          $arrIDsEntidades[] = $v['idestructura']; */
          $sql .= "SELECT DISTINCT(dp.idpersona), dpdi.numero as numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, nc.idcategoria, nc.denominacion as categoriapersona
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona  = dp.idpersona AND dco.identidad IN (" . implode(',', $arrIDsEntidades) . ") AND (dco.fechavencimiento is null or dco.fechavencimiento >= now()))
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.dat_categorizacion dc ON (dc.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoria nc ON (nc.idcategoria = dc.idcategoria)
			WHERE ";
        $sql .= $filtro . " ";
        }

        $sql .= " order by nombre limit {$limite} offset {$inicio} ;";
        //print_r($sql);die;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function CantidadBuscarPersonaNominaPorEntidadParams($params, $identidad, $arraycategorias = null)
    {


        if ($arraycategorias->cliente == 'MINFAR')
        {
            $filtro = '';
        if ($params->numid != "") {
            $filtro .= "dpdi.numero ilike '%" . $params->numid . "%' and ";
        }
        if ($params->nombre != "") {
            $filtro .= "lower(dp.nombre) ilike '%" . strtolower($params->nombre) . "%' and ";
        }
        if ($params->snombre != "") {
            $filtro .= "lower(dp.snombre) ilike '%" . strtolower($params->snombre) . "%' and ";
        }
        if ($params->primerapellido != "") {
            $filtro .= "lower(dp.papel) ilike '%" . strtolower($params->primerapellido) . "%' and ";
        }
        if ($params->segundoapellido != "") {
            $filtro .= "lower(dp.sapel) ilike '%" . strtolower($params->segundoapellido) . "%' and ";
        }
        if ($params->idpersona != "") {
            $filtro .= "dp.idpersona = '" . $params->idpersona . "' and ";
        }
        if ($params->idcategoriapersona != "") {
            $filtro .= "npc.idcategoriapersona = '" . $params->idcategoriapersona . "' and ";
        }
        if ($params->numerocuenta != "") {
            $filtro .= "dcb.numerocuenta ilike '%" . $params->numerocuenta . "%' and ";
        }
        if ($params->grado != "") {
            $filtro .= "lower(ng.denominacion) ilike '%" . strtolower($params->grado) . "%' and ";
        }

        $filtro .= " dp.feliminado is null";

        $integratorIOC = ZendExt_IoC::getInstance();
        //print_r($params->arrayidplantillas);die;
        if (count($params->arrayidplantillas) > 0) {
            $filtro .= ($filtro != '') ? ' and cpn.idplantillanominal in(' . implode(',', $params->arrayidplantillas) . ')' : 'cpn.idplantillanominal in(' . implode(',', $params->arrayidplantillas) . ')';
        }
        $sql .= "SELECT count(distinct(dp.idpersona)) as cantidad
            FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
            LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
            LEFT JOIN mod_personaext.dat_gradomilitar dg on (dg.idpersona = dp.idpersona and dg.fhasta is null)
            LEFT JOIN mod_estructuracomp.nom_grado ng on (ng.idgrado = dg.idgradomilitar)
			INNER JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
            INNER JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
            LEFT JOIN mod_personaext.dat_cuentabancaria dcb ON (dcb.idpersona = dp.idpersona)
			LEFT JOIN mod_nomina.dat_retencionpersona drp ON (drp.idpersona = dp.idpersona and drp.identidad = " . $identidad . ")
            WHERE ";
        $sql .= $filtro . " ";   
              
        }

        else {
            $filtro = '';
        if ($params->numid != "") {
            $filtro .= "dpdi.numero ilike '%" . $params->numid . "%' and ";
        }
        if ($params->nombre != "") {
            $filtro .= "lower(dp.nombre) ilike '%" . strtolower($params->nombre) . "%' and ";
        }
        if ($params->snombre != "") {
            $filtro .= "lower(dp.snombre) ilike '%" . strtolower($params->snombre) . "%' and ";
        }
        if ($params->primerapellido != "") {
            $filtro .= "lower(dp.papel) ilike '%" . strtolower($params->primerapellido) . "%' and ";
        }
        if ($params->segundoapellido != "") {
            $filtro .= "lower(dp.sapel) ilike '%" . strtolower($params->segundoapellido) . "%' and ";
        }
        if ($params->idpersona != "") {
            $filtro .= "dp.idpersona = '" . $params->idpersona . "' and ";
        }
        if ($params->idsexo != "") {
            $filtro .= "dp.idsexo = '" . $params->idsexo . "' and ";
        }
        if ($params->idcategoriapersona != "") {
            $filtro .= "dc.idcategoria = '" . $params->idcategoriapersona . "' and ";
        }
        if ($params->tipoidentidad != "") {
            $filtro .= "dpdi.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
        }

        $filtro .= " dp.feliminado is null";

        $integratorIOC = ZendExt_IoC::getInstance();
        //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
        //$arrEntidades = $integratorIOC->metadatos->BuscarEntidadesXidestructura($identidad);
        $arrIDsEntidades = array($identidad);
        /* $arrIDsEntidades = array();
          foreach ($arrEntidades as $i => $v)
          $arrIDsEntidades[] = $v['idestructura']; */
          $sql .= "SELECT count(distinct(dp.idpersona)) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona  = dp.idpersona AND dco.identidad IN (" . implode(',', $arrIDsEntidades) . ") AND (dco.fechavencimiento is null or dco.fechavencimiento >= now()))
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.dat_categorizacion dc ON (dc.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoria nc ON (nc.idcategoria = dc.idcategoria)
			WHERE ";
        $sql .= $filtro . " ";
        }
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($sql);
        return $resultado[0]['cantidad'];
    }

    public function BuscadorPersonasCargoDerechoIncremento($texto, $inicio, $limite, $identidad, $arraycategorias = null, $arrayidplantillas = null)
    {

        $where = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' or dpdi.numero ilike '%$arreglo[$i]%'";
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        $where .= ($where != '') ? ' and (dp.feliminado is null)' : ' dp.feliminado is null';
        if (count($arrayidplantillas) > 0) {
            $where .= ($where != '') ? ' and cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')' : 'cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')';
        }
        $integratorIOC = ZendExt_IoC::getInstance();
        $sql .= "SELECT DISTINCT(dp.idpersona), dpdi.numero as numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.sexo, dpcat.idcategoria,
                (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
				((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                npc.denominacion as categoriapersona
                FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			INNER JOIN mod_nomina.conf_cargoscertificacionincremento ccci ON (ccci.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
			WHERE " . $where . "";
        $sql .= " order by nombre ASC limit {$limite} offset {$inicio} ;";
        //print_r($sql);die;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function countBuscadorPersonasCargoDerechoIncremento($texto, $identidad, $arraycategorias = null, $arrayidplantillas = null)
    {

        $where = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' or dpdi.numero ilike '%$arreglo[$i]%'";
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        $where .= ($where != '') ? ' and (dp.feliminado is null)' : ' dp.feliminado is null';
        if (count($arrayidplantillas) > 0) {
            $where .= ($where != '') ? ' and cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')' : 'cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')';
        }
        /* $integratorIOC = ZendExt_IoC::getInstance();
          //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
          $arrEntidades = $integratorIOC->metadatos->BuscarEntidadbyDominio($identidad);
          $arrIDsEntidades = array();
          foreach ($arrEntidades as $i => $v)
          $arrIDsEntidades[] = $v->id; */

        $sql .= "SELECT count(distinct(dp.idpersona)) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			INNER JOIN mod_nomina.conf_cargoscertificacionincremento ccci ON (ccci.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
			WHERE " . $where . "";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($sql);
        return $resultado[0]['cantidad'];
    }

    public function BuscarPersonaNominaPorEntidadTexto($texto, $inicio, $limite, $identidad, $arraycategorias = null, $arrayidplantillas = null, $cargoprincipal)
    {

        $where = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        $where .= ($where != '') ? ' and (dp.feliminado is null and dco.idcargosocupados is not null)' : ' dp.feliminado is null and dco.idcargosocupados is not null';

        $integratorIOC = ZendExt_IoC::getInstance();
        if (count($arrayidplantillas) > 0) {
            $where .= ($where != '') ? ' and cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')' : 'cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')';
        }
        $sql = '';
        $selectidpers = ($cargoprincipal == 1) ? 'DISTINCT(dp.idpersona)' : 'dp.idpersona';
        $principalpers = ($cargoprincipal == 1) ? 'and dps.principal = 1' : '';
        if ($arraycategorias->cliente == 'MINFAR') {
            if (count($arraycategorias->arraycategorias) > 0) {
                $sql .= "SELECT DISTINCT(dp.idpersona), dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo, dpcat.idcategoria, dco.idcargosocupados,
                    (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                    (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
					((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                    npc.denominacion as categoriapersona, drp.idretencionpersona
            FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			INNER JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			INNER JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
			LEFT JOIN mod_nomina.dat_retencionpersona drp ON (drp.idpersona = dp.idpersona and drp.identidad = " . $identidad . ")
			WHERE " . ($where != '' ? "" . $where . " and npc.idcategoriapersona in (" . implode(',', $arraycategorias->arraycategorias) . ")" : $where) . "";
                $sql .= " order by dp.nombre ASC limit {$limite} offset {$inicio} ;";
            } else {
                return array();
            }
        } else {
            $sql .= "SELECT $selectidpers, dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dco.idcargo ,nc.denominacion as denomcargo,dp.sexo, dpcat.idcategoria, cpn.orden, dco.idcargosocupados,
                    (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                    (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
					((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                    npc.denominacion as categoriapersona, drp.idretencionpersona,
                    (CASE WHEN pcodc.cdgocontable is not null THEN pcodc.cdgocontable ELSE '' END) as cdgocontable 
            FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_personaentidad dpent ON (dpent.idpersona = dco.idpersona  and dpent.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = dpent.idpersonaentidad  and dps.idcargo = dco.idcargo {$principalpers} and dps.estado = 0)
			LEFT JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = dco.idcargo and dc.idestado = 0)
			LEFT JOIN mod_estructuracomp.nom_cargo nc ON (nc.idnomcargo = dc.idnomcargo)
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
            left join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
            LEFT JOIN mod_nomina.dat_retencionpersona drp ON (drp.idpersona = dp.idpersona and drp.identidad = " . $identidad . ")
			WHERE " . $where . "";
            $sql .= " order by dp.nombre ASC limit {$limite} offset {$inicio} ;";
        }

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection(); //print_r($sql);die;
        return $conn->fetchAll($sql);
    }

    public function BuscarPersonaNominaPorEntidadTextoRegistroSalarioTiempoServicio($texto, $inicio, $limite, $identidad, $arraycategorias = null, $arrayidplantillas = null, $cargoprincipal)
    {

        $where = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . "dpdi.numero ilike '%$arreglo[$i]%' or dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        $where .= ($where != '') ? ' and (dp.feliminado is null and dco.idcargosocupados is not null)' : ' dp.feliminado is null and dco.idcargosocupados is not null';

        $integratorIOC = ZendExt_IoC::getInstance();
        if (count($arrayidplantillas) > 0) {
            $where .= ($where != '') ? ' and cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')' : 'cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')';
        }
        $sql = '';
        $selectidpers = ($cargoprincipal == 1) ? 'DISTINCT(dp.idpersona)' : 'dp.idpersona';
        $principalpers = ($cargoprincipal == 1) ? 'and dps.principal = 1' : '';
        if ($arraycategorias->cliente == 'MINFAR') {
            if (count($arraycategorias->arraycategorias) > 0) {
                $sql .= "SELECT DISTINCT(dp.idpersona), dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo, dpcat.idcategoria, dco.idcargosocupados,
                    (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                    (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
					((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                    npc.denominacion as categoriapersona, drp.idretencionpersona
            FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			INNER JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			INNER JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
			LEFT JOIN mod_nomina.dat_retencionpersona drp ON (drp.idpersona = dp.idpersona and drp.identidad = " . $identidad . ")
			WHERE " . ($where != '' ? "" . $where . " and npc.idcategoriapersona in (" . implode(',', $arraycategorias->arraycategorias) . ")" : $where) . "";
                $sql .= " order by dp.nombre ASC limit {$limite} offset {$inicio} ;";
            } else {
                return array();
            }
        } else {
            $sql .= "SELECT $selectidpers, dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dco.idcargo ,nc.denominacion as denomcargo,dp.sexo, dpcat.idcategoria, cpn.orden, dco.idcargosocupados, nfe.ordenunico,
                    (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                    (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
					((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                    npc.denominacion as categoriapersona, drp.idretencionpersona,
                    (CASE WHEN pcodc.cdgocontable is not null THEN pcodc.cdgocontable ELSE '' END) as cdgocontable
            FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_personaentidad dpent ON (dpent.idpersona = dco.idpersona  and dpent.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = dpent.idpersonaentidad  and dps.idcargo = dco.idcargo {$principalpers} and dps.estado = 0)
			LEFT JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = dco.idcargo and dc.idestado = 0)
			LEFT JOIN mod_estructuracomp.nom_cargo nc ON (nc.idnomcargo = dc.idnomcargo)
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
            left join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
            LEFT JOIN mod_nomina.dat_retencionpersona drp ON (drp.idpersona = dp.idpersona and drp.identidad = " . $identidad . ")
            LEFT JOIN mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = dc.idcargo)
			WHERE " . $where . "";
            $sql .= " order by nfe.ordenunico ASC limit {$limite} offset {$inicio} ;";
        }

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection(); //print_r($sql);die;
        return $conn->fetchAll($sql);
    }

    public function BuscarPersonaRegistroSalarioTiempoServicioSIGERH($texto, $limite, $inicio, $identidad)
    {

        $where = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        $where .= ($where != '') ? ' and (dp.feliminado is null) and (dps.fhasta is null or dps.fhasta >= now())' : ' dp.feliminado is null and (dps.fhasta is null or dps.fhasta >= now())';


            $sql .= "SELECT dp.idpersona, dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo, dpcat.idcategoria, dps.idarea, deop.denominacion,
                    (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                    npc.denominacion as categoriapersona
            FROM mod_persona.dat_persona dp
            INNER JOIN mod_persona.dat_personaentidad doc ON (doc.idpersona = dp.idpersona  AND doc.identidad = " . $identidad . " and (doc.fhasta is null or doc.fhasta >= now()))
            INNER JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = doc.idpersonaentidad)
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
            LEFT JOIN mod_estructuracomp.dat_estructuraop deop ON (deop.idestructuraop = dps.idarea)
			WHERE " . $where . "";
            $sql .= " order by dp.nombre ASC limit {$limite} offset {$inicio} ;";


        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function BuscarPersonaNominaPorEntidadTextoCompartimentacion($texto, $inicio, $limite, $identidad, $arraycategorias = null, $arrayidplantillas = null, $cargoprincipal,$tipobusqueda)
    {

        $where = '';
        if($tipobusqueda == 2)
        {
            if ($texto->numid != "") {
                $where .= "dpdi.numero ilike '%" . $texto->numid . "%' and ";
            }
            if ($texto->nombre != "") {
                $where .= "lower(dp.nombre) ilike '%" . strtolower($texto->nombre) . "%' and ";
            }
            if ($texto->snombre != "") {
                $where .= "lower(dp.snombre) ilike '%" . strtolower($texto->snombre) . "%' and ";
            }
            if ($texto->primerapellido != "") {
                $where .= "lower(dp.papel) ilike '%" . strtolower($texto->primerapellido) . "%' and ";
            }
            if ($texto->segundoapellido != "") {
                $where .= "lower(dp.sapel) ilike '%" . strtolower($texto->segundoapellido) . "%' and ";
            }
            if ($texto->idpersona != "") {
                $where .= "dp.idpersona = '" . $texto->idpersona . "' and ";
            }
            if ($texto->idcategoriapersona != "") {
                $where .= "npc.idcategoriapersona = '" . $texto->idcategoriapersona . "' and ";
            }
            if ($texto->numerocuenta != "") {
                $where .= "dcb.numerocuenta ilike '%" . $texto->numerocuenta . "%' and ";
            }
            if ($texto->grado != "") {
                $where .= "lower(ng.denominacion) ilike '%" . strtolower($texto->grado) . "%' and ";
            } 
            $where .= " dp.feliminado is null";
        }
        else
        {
            if ($texto != '') {
                $arreglo = split(' ', $texto);
                $or = '';
                for ($i = 0; $i < count($arreglo); $i++) {
                    if ($arreglo[$i]) {
                        if ($where != '')
                            $or = 'or';
                        $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' or dpdi.numero ilike '%$arreglo[$i]%' ";
                    }
                }
            }
        }
        
        //if ($where != '')
         //   $where = '( ' . $where . ' )';
        $where .= ($where != '') ? ' and (dp.feliminado is null and dco.idcargosocupados is not null)' : ' dp.feliminado is null and dco.idcargosocupados is not null';

        $integratorIOC = ZendExt_IoC::getInstance();
        if (count($arrayidplantillas) > 0) {
            $where .= ($where != '') ? ' and cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')' : 'cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')';
        }
        $sql = '';
        $selectidpers = ($cargoprincipal == 1)?'DISTINCT(dp.idpersona)':'dp.idpersona';
        $principalpers = ($cargoprincipal == 1)?'and dps.principal = 1':'';
        if ($arraycategorias->cliente == 'MINFAR') {
            $sql .= "SELECT DISTINCT(dp.idpersona), dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo, dpcat.idcategoria, dco.idcargosocupados,
                (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
                ((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                npc.denominacion as categoriapersona, drp.idretencionpersona
        FROM mod_persona.dat_persona dp
        INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
        LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
        LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
        LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
        LEFT JOIN mod_personaext.dat_gradomilitar dg on (dg.idpersona = dp.idpersona and dg.fhasta is null)
        LEFT JOIN mod_estructuracomp.nom_grado ng on (ng.idgrado = dg.idgradomilitar)
        INNER JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
        INNER JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
        LEFT JOIN mod_personaext.dat_cuentabancaria dcb ON (dcb.idpersona = dp.idpersona)
        LEFT JOIN mod_nomina.dat_retencionpersona drp ON (drp.idpersona = dp.idpersona and drp.identidad = " . $identidad . ")
        WHERE " . $where . "";
            $sql .= " order by dp.nombre ASC limit {$limite} offset {$inicio} ;";
            //print_r($sql);die;

        } else {
            $sql .= "SELECT $selectidpers, dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dco.idcargo ,nc.denominacion as denomcargo,dp.sexo, dpcat.idcategoria, cpn.orden, dco.idcargosocupados,
                    (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                    (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
					((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                    npc.denominacion as categoriapersona, pcodc.cdgocontable, drp.idretencionpersona
            FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_situacionlaboral dps ON (dps.idcargo = dco.idcargo {$principalpers} and dps.estado = 0)
			LEFT JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = dco.idcargo)
			LEFT JOIN mod_estructuracomp.nom_cargo nc ON (nc.idnomcargo = dc.idnomcargo)
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
            left join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
            LEFT JOIN mod_nomina.dat_retencionpersona drp ON (drp.idpersona = dp.idpersona and drp.identidad = " . $identidad . ")
			WHERE " . $where . "";
            $sql .= " order by dp.nombre ASC limit {$limite} offset {$inicio} ;";
        }
        //print_r($sql);die;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection(); //print_r($sql);die;
        return $conn->fetchAll($sql);
    }

    public function BuscarPersonaNominaPorEntidadTextoHist($texto, $inicio, $limite, $identidad, $arraycategorias = null, $arrayidplantillas = null)
    {

        $where = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . "dpdi.numero ilike '%$arreglo[$i]%' or dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' or pcodc.cdgocontable = '$arreglo[$i]' ";
                }
            }
        }
        $where .= ($where != '') ? " and dco.idcargosocupados is null" : "dco.idcargosocupados is null";

        $sql = '';
        $sql .= "SELECT DISTINCT(dp.idpersona), dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo, dpcat.idcategoria, cpn.orden, nfe.ordenunico,
                    (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                    (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
					((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                npc.denominacion as categoriapersona, pcodc.cdgocontable
                FROM mod_persona.dat_persona dp
			LEFT JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
            LEFT join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
            LEFT JOIN mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = cpnc.idcargo)
            INNER join mod_nomina.dat_registrosalariotiemposervcio drsts ON (drsts.idpersona = dp.idpersona and drsts.idestructura =  " . $identidad . ")
			WHERE " . $where;
        $sql .= " order by nfe.ordenunico ASC limit {$limite} offset {$inicio} ;";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function BuscarPersonaNomina($texto, $inicio, $limite, $identidad, $arraycategorias = null, $arrayidplantillas = null, $tipobusqueda)
    {
        $where = '';
        if($tipobusqueda == 2)
        {
            if ($texto->numid != "") {
                $where .= "dpdi.numero ilike '%" . $texto->numid . "%' and ";
            }
            if ($texto->nombre != "") {
                $where .= "lower(dp.nombre) ilike '%" . strtolower($texto->nombre) . "%' and ";
            }
            if ($texto->snombre != "") {
                $where .= "lower(dp.snombre) ilike '%" . strtolower($texto->snombre) . "%' and ";
            }
            if ($texto->primerapellido != "") {
                $where .= "lower(dp.papel) ilike '%" . strtolower($texto->primerapellido) . "%' and ";
            }
            if ($texto->segundoapellido != "") {
                $where .= "lower(dp.sapel) ilike '%" . strtolower($texto->segundoapellido) . "%' and ";
            }
            if ($texto->idpersona != "") {
                $where .= "dp.idpersona = '" . $texto->idpersona . "' and ";
            }
            if ($texto->idcategoriapersona != "") {
                $where .= "npc.idcategoriapersona = '" . $texto->idcategoriapersona . "' and ";
            }
            if ($texto->numerocuenta != "") {
                $where .= "dcb.numerocuenta ilike '%" . $texto->numerocuenta . "%' and ";
            }
            if ($texto->grado != "") {
                $where .= "lower(ng.denominacion) ilike '%" . strtolower($texto->grado) . "%' and ";
            } 
            $where .= " dp.feliminado is null";
        }
        else
        {
            if ($texto != '') {
                $arreglo = split(' ', $texto);
                $or = '';
                for ($i = 0; $i < count($arreglo); $i++) {
                    if ($arreglo[$i]) {
                        if ($where != '')
                            $or = 'or';
                        $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' or dpdi.numero ilike '%$arreglo[$i]%'";
                    }
                }
            }
        }
        
        //if ($where != '')
         //   $where = '( ' . $where . ' )';
        $where .= ($where != '') ? ' and (dp.feliminado is null and dco.idcargosocupados is not null)' : ' dp.feliminado is null and dco.idcargosocupados is not null';
        if (count($arrayidplantillas) > 0) {
            $where .= ($where != '') ? ' and cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')' : 'cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')';
        }
        $integratorIOC = ZendExt_IoC::getInstance();
        //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
        //$arrEntidades = $integratorIOC->metadatos->BuscarEntidadbyDominio($identidad);
        //$arrIDsEntidades = array();
        /* foreach ($arrEntidades as $i => $v)
          $arrIDsEntidades[] = $v->id; */
        $sql = '';
        if ($arraycategorias->cliente == 'MINFAR') {
            if (count($arraycategorias->arraycategorias) > 0) {
                $sql .= "SELECT DISTINCT(dp.idpersona), dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo, dpcat.idcategoria,cpn.orden,
                    (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                    (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
					((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                npc.denominacion as categoriapersona
                FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
            LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
            LEFT JOIN mod_personaext.dat_gradomilitar dg on (dg.idpersona = dp.idpersona and dg.fhasta is null)
            LEFT JOIN mod_estructuracomp.nom_grado ng on (ng.idgrado = dg.idgradomilitar)
			INNER JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
            INNER JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
            LEFT JOIN mod_personaext.dat_cuentabancaria dcb ON (dcb.idpersona = dp.idpersona)
			INNER JOIN mod_nomina.dat_reintegropersona rp ON (rp.idpersona = dp.idpersona)
			WHERE " . ($where != '' ? "" . $where : $where) . "";
            } else {
                return array();
            }
        } else {
            $sql .= "SELECT DISTINCT(dp.idpersona), dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo, dpcat.idcategoria,cpn.orden,
                    (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                    (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
					((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                npc.denominacion as categoriapersona
                FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
			INNER JOIN mod_nomina.dat_reintegropersona rp ON (rp.idpersona = dp.idpersona)
			WHERE " . $where . "";
        }

        $sql .= " order by dp.nombre ASC limit {$limite} offset {$inicio} ;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function CantidadBuscarPersonaNominaPorEntidadTexto($texto, $identidad, $arraycategorias = null, $arrayidplantillas = null, $historico, $cargoprincipal)
    {

        $where = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        $where .= ($where != '') ? ' and (dp.feliminado is null)' : ' dp.feliminado is null';
        if (count($arrayidplantillas) > 0) {
            $where .= ($where != '') ? ' and cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')' : 'cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')';
        }
        $sql = '';
        if ($arraycategorias->cliente == 'MINFAR') {
            if (count($arraycategorias->arraycategorias) > 0) {
                $sql .= "SELECT count(distinct(dp.idpersona)) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			INNER JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			INNER JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
			WHERE " . ($where != '' ? "" . $where . " and npc.idcategoriapersona in (" . implode(',', $arraycategorias->arraycategorias) . ")" : $where) . "";
            } else {
                return array();
            }
        } else {
            $sql .= "SELECT count(distinct(dp.idpersona)) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
                        left join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
			WHERE " . $where . ";";
        }

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($sql);
        return $resultado[0]['cantidad'];
    }

    public function CantidadBuscarPersonaNominaPorEntidadTextoRegistroSalarioTiempoServicio($texto, $identidad, $arraycategorias = null, $arrayidplantillas = null, $historico, $cargoprincipal)
    {

        $where = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        $where .= ($where != '') ? ' and (dp.feliminado is null)' : ' dp.feliminado is null';
        if (count($arrayidplantillas) > 0) {
            $where .= ($where != '') ? ' and cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')' : 'cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')';
        }
        $sql = '';
        if ($arraycategorias->cliente == 'MINFAR') {
            if (count($arraycategorias->arraycategorias) > 0) {
                $sql .= "SELECT count(distinct(dp.idpersona)) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			INNER JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			INNER JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
			WHERE " . ($where != '' ? "" . $where . " and npc.idcategoriapersona in (" . implode(',', $arraycategorias->arraycategorias) . ")" : $where) . "";
            } else {
                return array();
            }
        } else {
            $sql .= "SELECT count(distinct(dp.idpersona)) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
                        left join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
			WHERE " . $where . ";";
        }

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($sql);
        return $resultado[0]['cantidad'];
    }

    public function CantidadPersonaTextoRegistroSalarioTiempoServicioSIGERH($texto, $limite, $inicio, $identidad)
    {

        $where = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        $where .= ($where != '') ? ' and (dp.feliminado is null) and (dps.fhasta is null or dps.fhasta >= now())' : ' dp.feliminado is null and (dps.fhasta is null or dps.fhasta >= now())';


        $sql .= "SELECT count(dp.idpersona) as cantidad
            FROM mod_persona.dat_persona dp
            INNER JOIN mod_persona.dat_personaentidad doc ON (doc.idpersona = dp.idpersona  AND doc.identidad = " . $identidad . " and (doc.fhasta is null or doc.fhasta >= now()))
            INNER JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = doc.idpersonaentidad)
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
            LEFT JOIN mod_estructuracomp.dat_estructuraop deop ON (deop.idestructuraop = dps.idarea)
			WHERE " . $where . "";
        $sql .= "limit {$limite} offset {$inicio} ;";


        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchOne($sql);
    }

    public function CantidadBuscarPersonaNominaPorEntidadTextoCompartimentacion($texto, $identidad, $arraycategorias = null, $arrayidplantillas = null, $historico, $cargoprincipal, $tipobusqueda)
    {

        $where = '';
        if($tipobusqueda == 2)
        {
            if ($texto->numid != "") {
                $where .= "dpdi.numero ilike '%" . $texto->numid . "%' and ";
            }
            if ($texto->nombre != "") {
                $where .= "lower(dp.nombre) ilike '%" . strtolower($texto->nombre) . "%' and ";
            }
            if ($texto->snombre != "") {
                $where .= "lower(dp.snombre) ilike '%" . strtolower($texto->snombre) . "%' and ";
            }
            if ($texto->primerapellido != "") {
                $where .= "lower(dp.papel) ilike '%" . strtolower($texto->primerapellido) . "%' and ";
            }
            if ($texto->segundoapellido != "") {
                $where .= "lower(dp.sapel) ilike '%" . strtolower($texto->segundoapellido) . "%' and ";
            }
            if ($texto->idpersona != "") {
                $where .= "dp.idpersona = '" . $texto->idpersona . "' and ";
            }
            if ($texto->idcategoriapersona != "") {
                $where .= "npc.idcategoriapersona = '" . $texto->idcategoriapersona . "' and ";
            }
            if ($texto->numerocuenta != "") {
                $where .= "dcb.numerocuenta ilike '%" . $texto->numerocuenta . "%' and ";
            }
            if ($texto->grado != "") {
                $where .= "lower(ng.denominacion) ilike '%" . strtolower($texto->grado) . "%' and ";
            } 
            $where .= " dp.feliminado is null";
        }
        else
        {
            if ($texto != '') {
                $arreglo = split(' ', $texto);
                $or = '';
                for ($i = 0; $i < count($arreglo); $i++) {
                    if ($arreglo[$i]) {
                        if ($where != '')
                            $or = 'or';
                        $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' or dpdi.numero ilike '%$arreglo[$i]%' ";
                    }
                }
            }
        }
        
        //if ($where != '')
         //   $where = '( ' . $where . ' )';
        $where .= ($where != '') ? ' and (dp.feliminado is null)' : ' dp.feliminado is null';
        if (count($arrayidplantillas) > 0) {
            $where .= ($where != '') ? ' and cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')' : 'cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')';
        }
        $sql = '';
        if ($arraycategorias->cliente == 'MINFAR') {
                $sql .= "SELECT count(distinct(dp.idpersona)) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
            LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
            LEFT JOIN mod_personaext.dat_gradomilitar dg on (dg.idpersona = dp.idpersona and dg.fhasta is null)
            LEFT JOIN mod_estructuracomp.nom_grado ng on (ng.idgrado = dg.idgradomilitar)
			INNER JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
            INNER JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
            LEFT JOIN mod_personaext.dat_cuentabancaria dcb ON (dcb.idpersona = dp.idpersona)
			WHERE " . $where . "";

        } else {
            $sql .= "SELECT count(distinct(dp.idpersona)) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
                        left join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
			WHERE " . $where . ";";
        }
        //print_r($sql);die;

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($sql);
        return $resultado[0]['cantidad'];
    }

    public function CantidadBuscarPersonaNominaPorEntidadTextoHist($texto, $identidad, $arraycategorias = null, $arrayidplantillas = null, $historico)
    {
        $where = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' or pcodc.cdgocontable = '$arreglo[$i]' ";
                }
            }
        }
        $where .= ($where != '') ? " and dco.idcargosocupados is null" : "dco.idcargosocupados is null";
        $sql = '';
        $sql .= "SELECT count(distinct(dp.idpersona)) as cantidad
			FROM mod_persona.dat_persona dp
			LEFT JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
            LEFT join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
			INNER join mod_nomina.dat_registrosalariotiemposervcio drsts ON (drsts.idpersona = dp.idpersona and drsts.idestructura =  " . $identidad . ")
			WHERE " . $where . ";";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($sql);
        return $resultado[0]['cantidad'];
    }

    public function CantidadBuscarPersonaNomina($texto, $identidad, $arraycategorias = null, $arrayidplantillas = null)
    {

        $where = '';
        if($tipobusqueda == 2)
        {
            if ($texto->numid != "") {
                $where .= "dpdi.numero ilike '%" . $texto->numid . "%' and ";
            }
            if ($texto->nombre != "") {
                $where .= "lower(dp.nombre) ilike '%" . strtolower($texto->nombre) . "%' and ";
            }
            if ($texto->snombre != "") {
                $where .= "lower(dp.snombre) ilike '%" . strtolower($texto->snombre) . "%' and ";
            }
            if ($texto->primerapellido != "") {
                $where .= "lower(dp.papel) ilike '%" . strtolower($texto->primerapellido) . "%' and ";
            }
            if ($texto->segundoapellido != "") {
                $where .= "lower(dp.sapel) ilike '%" . strtolower($texto->segundoapellido) . "%' and ";
            }
            if ($texto->idpersona != "") {
                $where .= "dp.idpersona = '" . $texto->idpersona . "' and ";
            }
            if ($texto->idcategoriapersona != "") {
                $where .= "npc.idcategoriapersona = '" . $texto->idcategoriapersona . "' and ";
            }
            if ($texto->numerocuenta != "") {
                $where .= "dcb.numerocuenta ilike '%" . $texto->numerocuenta . "%' and ";
            }
            if ($texto->grado != "") {
                $where .= "lower(ng.denominacion) ilike '%" . strtolower($texto->grado) . "%' and ";
            }
    
            $where .= " dp.feliminado is null"; 
        }
        else
        {
            if ($texto != '') {
                $arreglo = split(' ', $texto);
                $or = '';
                for ($i = 0; $i < count($arreglo); $i++) {
                    if ($arreglo[$i]) {
                        if ($where != '')
                            $or = 'or';
                        $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' or dpdi.numero ilike '%$arreglo[$i]%'";
                    }
                }
            }
        }
        $where .= ($where != '') ? ' and (dp.feliminado is null)' : ' dp.feliminado is null';
        if (count($arrayidplantillas) > 0) {
            $where .= ($where != '') ? ' and cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')' : 'cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')';
        }
        /* $integratorIOC = ZendExt_IoC::getInstance();
          //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
          $arrEntidades = $integratorIOC->metadatos->BuscarEntidadbyDominio($identidad);
          $arrIDsEntidades = array();
          foreach ($arrEntidades as $i => $v)
          $arrIDsEntidades[] = $v->id; */
        $sql = '';
        if ($arraycategorias->cliente == 'MINFAR') {
            if (count($arraycategorias->arraycategorias) > 0) {
                $sql .= "SELECT count(distinct(dp.idpersona)) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_gradomilitar dg on (dg.idpersona = dp.idpersona and dg.fhasta is null)
            LEFT JOIN mod_estructuracomp.nom_grado ng on (ng.idgrado = dg.idgradomilitar)
			INNER JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
            INNER JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
            LEFT JOIN mod_personaext.dat_cuentabancaria dcb ON (dcb.idpersona = dp.idpersona)
			INNER JOIN mod_nomina.dat_reintegropersona rp ON (rp.idpersona = dp.idpersona)
			WHERE " . ($where != '' ? "" . $where : $where) . "";
            } else {
                return array();
            }
        } else {
            $sql .= "SELECT count(distinct(dp.idpersona)) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $identidad . ")
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
			INNER JOIN mod_nomina.dat_reintegropersona rp ON (rp.idpersona = dp.idpersona)
			WHERE " . $where . ";";
        }

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($sql);
        return $resultado[0]['cantidad'];
    }

    public function BuscadorNomina($inicio = 0, $limite = 20, $texto, $idestructura, $iddominio, $permiso, $campocolores, $arraycategorias = null, $arrayidplantillas = null, $categoriapersonabuscar, $arrcargos, $tipobusqueda, $activo)
    {
        $where = '';
        $where1 = '';

        if($tipobusqueda == 2)
        {
            if ($texto->numid != "") {
                $where .= "dpdi.numero ilike '%" . $texto->numid . "%' and ";
            }
            if ($texto->nombre != "") {
                $where .= "lower(dp.nombre) ilike '%" . strtolower($texto->nombre) . "%' and ";
            }
            if ($texto->snombre != "") {
                $where .= "lower(dp.snombre) ilike '%" . strtolower($texto->snombre) . "%' and ";
            }
            if ($texto->primerapellido != "") {
                $where .= "lower(dp.papel) ilike '%" . strtolower($texto->primerapellido) . "%' and ";
            }
            if ($texto->segundoapellido != "") {
                $where .= "lower(dp.sapel) ilike '%" . strtolower($texto->segundoapellido) . "%' and ";
            }
            if ($texto->idpersona != "") {
                $where .= "dp.idpersona = '" . $texto->idpersona . "' and ";
            }
            if ($texto->idcategoriapersona != "") {
                $where .= "npc.idcategoriapersona = '" . $texto->idcategoriapersona . "' and ";
            }
            if ($texto->numerocuenta != "") {
                $where .= "dcb.numerocuenta ilike '%" . $texto->numerocuenta . "%' and ";
            }
            if ($texto->grado != "") {
                $where .= "lower(ng.denominacion) ilike '%" . strtolower($texto->grado) . "%' and ";
            } 
            $where .= " dp.feliminado is null";
        }
        else
        {
            if ($texto != '') {
                $arreglo = split(' ', $texto);
                $or = '';
                for ($i = 0; $i < count($arreglo); $i++) {
                    if ($arreglo[$i]) {
                        if ($where != '')
                            $or = ' or ';
                        //$where .= $or . "dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' or pcodc.cdgocontable = '$arreglo[$i]' ";
                        $where .= $or . "dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' or dpdi.numero ilike '%$arreglo[$i]%'";
                        //$where1 .= $or . "dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%' or pcodc.cdgocontable = '$arreglo[$i]' ";
                        $where1 .= $or . "dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%' or dpdi.numero ilike '%$arreglo[$i]%'";
                    }
                }
            }
        }
        
        /*if ($where != '')
            $where = '( ' . $where . ' )';
        if ($where1 != '')
            $where1 = '( ' . $where1 . ' )';*/
        $where .= ($where != '') ? ' and (dp.feliminado is null) and (((dps.fhasta is null or dps.fhasta >= now())) or (dco.idcargosocupados is not null and dco.identidad = ?))' : '(dp.feliminado is null) and (((doc.fhasta is null or doc.fhasta >= now()) and (dps.fhasta is null or dps.fhasta >= now()) or (dco.idcargosocupados is not null and dco.identidad = ?)))';
        $where1 .= ($where1 != '') ? ' and (dp1.feliminado is null)' : ' dp1.feliminado is null';
        if (count($arrayidplantillas) > 0) {
            $where .= ($where != '') ? ' and cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')' : 'cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')';

        }
        if($arrcargos){
            //Para que la persona salga en la consulta aunque el idcargo de datcargosocupados no este en el $arrcargos que viene de estructura 
        $implodecargocpcc = '(dco.idcargo in(' . implode(',', $arrcargos) . ') or (dco.idcargo not in(' . implode(',', $arrcargos) . ')))';
		//Para que la persona salga en la consulta aunque el no exista el idcargo en datcargosocupados y si este en datsituacion  
        $implodecargocpss = 'dps.idcargo in(' . implode(',', $arrcargos) . ')';
        $where .= ($where != '') ? ' and (('.$implodecargocpcc.') or ('.$implodecargocpss.'))': '(('.$implodecargocpcc.') or ('.$implodecargocpss.'))';
        }

        if ($activo != null) {
            $where.= ' and dco.activa = ' . $activo;
        }
        
		
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = '';
        //Caso MINFAR, y las entidades del pais que compartimentan a nivel de entidades
        if ($arraycategorias->cliente == 'MINFAR') {
            if (count($arraycategorias->arraycategorias) > 0) {
                $sql = "SELECT DISTINCT(dp.idpersona), dps.idpersonaentidad, dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo, dpcat.idcategoria,
                    (CASE WHEN dp.snombre is not null THEN dp.snombre
                    ELSE '' END) as snombre,
                    (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
                    ((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                    (select d.idinterrupto from mod_fuerzatrabajo.dat_interrupto as d where (d.fhasta is null or d.fhasta >= now()) and dps.idsituacionlaboralp = d.idsituacionlaboralp) as idinterrupto,
                (select dis.iddisponible from mod_fuerzatrabajo.dat_disponible as dis where (dis.fhasta is null or dis.fhasta >= now()) and dps.idsituacionlaboralp = dis.idsituacionlaboralp) as iddisponible,
                npc.denominacion as categoriapersona
                ,(select dco.idcargosocupados where dco.identidad = " . $idestructura . ") as idcargosocupados
                FROM mod_persona.dat_persona dp
                INNER JOIN mod_persona.dat_personaentidad doc ON (doc.idpersona = dp.idpersona  AND doc.identidad = " . $idestructura . ")
                INNER JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = doc.idpersonaentidad)
                LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
                LEFT JOIN mod_personaext.dat_gradomilitar dg on (dg.idpersona = dp.idpersona and dg.fhasta is null)
                LEFT JOIN mod_estructuracomp.nom_grado ng on (ng.idgrado = dg.idgradomilitar)
                INNER JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
                INNER JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
                LEFT JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona and dco.identidad = " . $idestructura . ")
                LEFT JOIN mod_personaext.dat_cuentabancaria dcb ON (dcb.idpersona = dp.idpersona)
                LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
                LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $idestructura . ")
                WHERE " . ($where != '' ? "" . $where : $where) . "";
                $sql .= " order by plantilla limit {$limite} offset {$inicio} ;";
            } else {
                return array();
            }
        } else {
            /*$sql = "SELECT DISTINCT(dp.idpersona), dps.idpersonaentidad, dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo, dpcat.idcategoria,
                 (CASE WHEN dp.snombre is not null THEN dp.snombre
                ELSE '' END) as snombre,
                (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
                ((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                (select d.idinterrupto from mod_fuerzatrabajo.dat_interrupto as d where (d.fhasta is null or d.fhasta >= now()) and dps.idsituacionlaboralp = d.idsituacionlaboralp) as idinterrupto,
                (select dis.iddisponible from mod_fuerzatrabajo.dat_disponible as dis where (dis.fhasta is null or dis.fhasta >= now()) and dps.idsituacionlaboralp = dis.idsituacionlaboralp) as iddisponible,
                npc.denominacion as categoriapersona
                ,(select dco.idcargosocupados where dco.identidad = " . $idestructura . ") as idcargosocupados, pcodc.cdgocontable
                FROM mod_persona.dat_persona dp
                INNER JOIN mod_persona.dat_personaentidad doc ON (doc.idpersona = dp.idpersona  AND doc.identidad = " . $idestructura . ")
                INNER JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = doc.idpersonaentidad)
                LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
                LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
                LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
                LEFT JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona and dco.identidad = " . $idestructura . ")
                LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
                LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $idestructura . ")
                        left join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
                WHERE " . $where;
                $sql .= " order by dp.nombre ASC limit {$limite} offset {$inicio} ;";*/

            $sql = "SELECT DISTINCT(dp.idpersona), /*dps.idpersonaentidad,*/ dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo, dpcat.idcategoria, nfe.ordenunico,
                 (CASE WHEN dp.snombre is not null THEN dp.snombre
                ELSE '' END) as snombre,
                (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
                
                ( case when dco.activa = 0 then 'Sin plantilla nominal'
                    else
                        ((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) 
                                WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END))
                    end
                ) as plantilla,
                /*
                ((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) 
                WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) 
                as plantilla,
                */
                (select d.idinterrupto from mod_fuerzatrabajo.dat_interrupto as d where (d.fhasta is null or d.fhasta >= now()) and dps.idsituacionlaboralp = d.idsituacionlaboralp) as idinterrupto,
                (select dis.iddisponible from mod_fuerzatrabajo.dat_disponible as dis where (dis.fhasta is null or dis.fhasta >= now()) and dps.idsituacionlaboralp = dis.idsituacionlaboralp) as iddisponible,
                npc.denominacion as categoriapersona
                ,(select dco.idcargosocupados where dco.identidad = " . $idestructura . ") as idcargosocupados, 
                (CASE WHEN pcodc.cdgocontable is not null THEN pcodc.cdgocontable ELSE '' END) as cdgocontable, nc.denominacion as denomcargo, dco.activa 
                FROM mod_persona.dat_persona dp			
                LEFT JOIN mod_persona.dat_personaentidad doc ON (doc.idpersona = dp.idpersona)
                LEFT JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = doc.idpersonaentidad)
                LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
                LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
                LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
                LEFT JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona and dco.identidad = " . $idestructura . ")
                LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
                LEFT JOIN mod_estructuracomp.nom_filaestruc nfe ON (nfe.idfila = dco.idcargo)
                LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $idestructura . ")
                left join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
                LEFT JOIN mod_estructuracomp.dat_cargo dc on (dc.idcargo = dco.idcargo)
                LEFT JOIN mod_estructuracomp.nom_cargo nc on (nc.idnomcargo = dc.idnomcargo)
                WHERE " . $where;
            $sql .= " order by dco.activa DESC, nfe.ordenunico ASC limit {$limite} offset {$inicio} ;";
        }

        $resultado = $conn->fetchAll($sql, array($idestructura));

        return $resultado;
    }

    public function countBuscadorNomina($texto, $idestructura, $iddominio, $permiso, $arraycategorias = null, $arrayidplantillas = null, $categoriapersonabuscar, $arrcargos, $tipobusqueda)
    {
        $where = '';
        $where1 = '';
        if($tipobusqueda == 2)
        {
            if ($texto->numid != "") {
                $where .= "dpdi.numero ilike '%" . $texto->numid . "%' and ";
            }
            if ($texto->nombre != "") {
                $where .= "lower(dp.nombre) ilike '%" . strtolower($texto->nombre) . "%' and ";
            }
            if ($texto->snombre != "") {
                $where .= "lower(dp.snombre) ilike '%" . strtolower($texto->snombre) . "%' and ";
            }
            if ($texto->primerapellido != "") {
                $where .= "lower(dp.papel) ilike '%" . strtolower($texto->primerapellido) . "%' and ";
            }
            if ($texto->segundoapellido != "") {
                $where .= "lower(dp.sapel) ilike '%" . strtolower($texto->segundoapellido) . "%' and ";
            }
            if ($texto->idpersona != "") {
                $where .= "dp.idpersona = '" . $texto->idpersona . "' and ";
            }
            if ($texto->idcategoriapersona != "") {
                $where .= "npc.idcategoriapersona = '" . $texto->idcategoriapersona . "' and ";
            }
            if ($texto->numerocuenta != "") {
                $where .= "dcb.numerocuenta ilike '%" . $texto->numerocuenta . "%' and ";
            }
            if ($texto->grado != "") {
                $where .= "lower(ng.denominacion) ilike '%" . strtolower($texto->grado) . "%' and ";
            } 
            $where .= " dp.feliminado is null";
        }
        else
        {
            if ($texto != '') {
                $arreglo = split(' ', $texto);
                $or = '';
                for ($i = 0; $i < count($arreglo); $i++) {
                    if ($arreglo[$i]) {
                        if ($where != '')
                            $or = ' or ';
                        $where .= $or . "dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%'  or pcodc.cdgocontable = '$arreglo[$i]' or dpdi.numero ilike '%$arreglo[$i]%'";
                        $where1 .= $or . "dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%'  or pcodc.cdgocontable = '$arreglo[$i]' or dpdi.numero ilike '%$arreglo[$i]%'";
                    }
                }
            }
        }
        
        /*if ($where != '')
            $where = '( ' . $where . ' )';
        if ($where != '')
            $where1 = '( ' . $where1 . ' )';*/
        $where .= ($where != '') ? ' and (dp.feliminado is null) and (((dps.fhasta is null or dps.fhasta >= now())) or (dco.idcargosocupados is not null))' : '(dp.feliminado is null) and (((doc.fhasta is null or doc.fhasta >= now()) and (dps.fhasta is null or dps.fhasta >= now()) or (dco.idcargosocupados is not null)))';
        $where1 .= ($where1 != '') ? 'and (dp1.feliminado is null)' : ' dp1.feliminado is null';
        if (count($arrayidplantillas) > 0) {
            $where .= ($where != '') ? ' and cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')' : 'cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')';
        }
        if($arrcargos){
            //Para que la persona salga en la consulta aunque el idcargo de datcargosocupados no este en el $arrcargos que viene de estructura 
        $implodecargocpcc = '(dco.idcargo in(' . implode(',', $arrcargos) . ') or (dco.idcargo not in(' . implode(',', $arrcargos) . ')))';
		//Para que la persona salga en la consulta aunque el no exista el idcargo en datcargosocupados y si este en datsituacion  
        $implodecargocpss = 'dps.idcargo in(' . implode(',', $arrcargos) . ')';
        $where .= ($where != '') ? ' and (('.$implodecargocpcc.') or ('.$implodecargocpss.'))': '(('.$implodecargocpcc.') or ('.$implodecargocpss.'))';
        }
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = '';
        //if($tipoestructura == 3){
        if ($arraycategorias->cliente == 'MINFAR') {
            if (count($arraycategorias->arraycategorias) > 0) {
                $sql = "SELECT count(*) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_persona.dat_personaentidad doc ON (doc.idpersona = dp.idpersona  AND doc.identidad = " . $idestructura . ")
			INNER JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = doc.idpersonaentidad)
            LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
            LEFT JOIN mod_personaext.dat_gradomilitar dg on (dg.idpersona = dp.idpersona and dg.fhasta is null)
            LEFT JOIN mod_estructuracomp.nom_grado ng on (ng.idgrado = dg.idgradomilitar)
			INNER JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			INNER JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
			LEFT JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona)
            LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dps.idcargo)
            LEFT JOIN mod_personaext.dat_cuentabancaria dcb ON (dcb.idpersona = dp.idpersona)
            LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $idestructura . ")
            left join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
            WHERE " . ($where != '' ? "" . $where : $where) . "";
            } else {
                return array();
            }
        } else {
            /*$sql = "SELECT count(*) as cantidad
        FROM mod_persona.dat_persona dp
        INNER JOIN mod_persona.dat_personaentidad doc ON (doc.idpersona = dp.idpersona  AND doc.identidad = " . $idestructura . ")
        INNER JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = doc.idpersonaentidad)
        LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
        LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
        LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
        LEFT JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona)
        LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dps.idcargo)
        LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $idestructura . ")
        left join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
          WHERE " . $where;*/

            $sql = "SELECT count(*) as cantidad
			FROM mod_persona.dat_persona dp
			LEFT JOIN mod_persona.dat_personaentidad doc ON (doc.idpersona = dp.idpersona)
			LEFT JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = doc.idpersonaentidad)
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
			LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
			LEFT JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona)
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dps.idcargo)
            LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $idestructura . ")
            left join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
          	WHERE " . $where;
        }
        //}else{

        //}

        $result = $conn->fetchAll($sql);

        if (count($result) > 0)
            $resultado = $result[0]['cantidad'];
        else
            $resultado = 0;

        return $resultado;
    }

    public function agregarDqlDatosPersona(Doctrine_Query $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $includeDqlSelect, array $includeTablas)
    {
        if ($includeDqlSelect) {
            $objDoctrineQuery->addSelect("$aliasTabla.idpersona AS idpersona, $aliasTabla.numid AS numid
            , $aliasTabla.nombre AS nombre, $aliasTabla.snombre AS snombre, $aliasTabla.papel AS papel
                , $aliasTabla.sapel AS sapel");
        }
        $objDoctrineQuery->innerJoin("$aliasTablaReferencia.DatPersona $aliasTabla");
        if (is_array($includeTablas) && !empty($includeTablas)) {
            foreach ($includeTablas as $v) {
                $tabla = $v['tabla'] . ' ' . $v['alia'];
                if ($v['relacion']) {
                    switch (strtolower($v['relacion'])) {
                        case 'leftjoin':
                            $objDoctrineQuery->leftJoin("$aliasTabla.$tabla");
                            break;
                        default:
                            $objDoctrineQuery->innerJoin("$aliasTabla.$tabla");
                            break;
                    }
                } else {
                    $objDoctrineQuery->innerJoin("$aliasTabla.$tabla");
                }
            }
        }
        return $objDoctrineQuery;
    }

    public function BuscadorPersonasCuentasBancarias($texto, $inicio = 0, $limite = 20, $idestructura)
    {
        $arrayidestructura = implode(',', $idestructura);
        $where = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = ' or ';
                    $where .= $or . " and (dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%') ";
                }
            }
        }


        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT DISTINCT(dp.idpersona),  dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo,dcb.idcuentabancaria,
        (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
        (CASE WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
        ((CASE WHEN cpn.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion
        from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = cpn.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla
        FROM mod_persona.dat_persona dp
        INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona)
        LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
        LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal)
        LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
        LEFT JOIN mod_personaext.dat_cuentabancaria dcb ON (dcb.idpersona = dp.idpersona)
        WHERE dcb.idcuentabancaria is null and dco.identidad in ({$arrayidestructura})  and cpn.identidad in ({$arrayidestructura})" . $where;
        $sql .= " order by plantilla limit {$limite} offset {$inicio} ;";

        return $conn->fetchAll($sql);
    }

    public function countBuscadorPersonasCuentasBancarias($texto, $idestructura)
    {
        $arrayidestructura = implode(',', $idestructura);
        $where = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = ' or ';
                    $where .= $or . " and (dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%') ";
                }
            }
        }


        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT count(*) as cantidad
        FROM mod_persona.dat_persona dp
        INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona)
        LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
        LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal)
        LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
        LEFT JOIN mod_personaext.dat_cuentabancaria dcb ON (dcb.idpersona = dp.idpersona)
        WHERE dcb.idcuentabancaria is null  and dco.identidad in ({$arrayidestructura})  and cpn.identidad in ({$arrayidestructura})" . $where;

        $result = $conn->fetchAll($sql);
        return $result[0]['cantidad'];
    }

    //Talon de pago de nomina
    public function BuscadorPersonasTalonPago($texto, $inicio = 0, $limite = 20, $identidad, $idelaborarpagos, $tipobusqueda)
    {

        $idelaborarpagos = is_array($idelaborarpagos) ? implode(',', $idelaborarpagos) : $idelaborarpagos;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $where = '';
        
        if ($tipobusqueda == 2) {
            $where = $this->FiltrarPorParamsNomina($texto);
        }else {
            if ($texto != '') {
                /*$arreglo = split(' ', $texto);
                $or = '';
                for ($i = 0; $i < count($arreglo); $i++) {
                    if ($arreglo[$i]) {
                        if ($where != '')
                            $or = 'or';
                        $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%'";
                    }
                }*/
                $where .=  " dpdi.numero ilike '%$texto%' or dp.nombre ilike '%$texto%' or dp.snombre ilike '%$texto%' or dp.papel ilike '%$texto%' or dp.sapel ilike '%$texto%'";
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        $where .= ($where != '') ? ' and (dp.feliminado is null and dco.idcargosocupados is not null and dpep.idelaborarpagos IN (' . $idelaborarpagos . ') and dpep.excluido = 0)' : ' dp.feliminado is null and dco.idcargosocupados is not null and dpep.idelaborarpagos IN (' . $idelaborarpagos . ') and dpep.excluido = 0';
        $sql = "";
        $sql .= "SELECT DISTINCT(dp.idpersona), dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo, cpn.orden,
                 (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                 (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
				 ((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal)
				 WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla
                 FROM mod_persona.dat_persona dp
			     INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			     LEFT  JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			     LEFT  JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal)
			     LEFT  JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			     INNER JOIN mod_nomina.dat_personaselaborarpagos dpep ON (dpep.idpersona = dp.idpersona)
			     WHERE " . $where;
        $sql .= " order by dp.nombre ASC limit {$limite} offset {$inicio} ;";
        return $conn->fetchAll($sql);
    }

    public function FiltrarPorParamsNomina($params)
    {
        $filtro = '';
        if ($params->numid != "") {
            $filtro .= "dpdi.numero ilike '%" . $params->numid . "%' and ";
        }
        if ($params->nombre != "") {
            $filtro .= "lower(dp.nombre) ilike '%" . strtolower($params->nombre) . "%' and ";
        }
        if ($params->snombre != "") {
            $filtro .= "lower(dp.snombre) ilike '%" . strtolower($params->snombre) . "%' and ";
        }
        if ($params->primerapellido != "") {
            $filtro .= "lower(dp.papel) ilike '%" . strtolower($params->primerapellido) . "%' and ";
        }
        if ($params->segundoapellido != "") {
            $filtro .= "lower(dp.sapel) ilike '%" . strtolower($params->segundoapellido) . "%' and ";
        }
        if ($params->idpersona != "") {
            $filtro .= "dp.idpersona = '" . $params->idpersona . "' and ";
        }
        if ($params->idcategoriapersona != "") {
            $filtro .= "npc.idcategoriapersona = '" . $params->idcategoriapersona . "' and ";
        }
        if ($params->numerocuenta != "") {
            $filtro .= "dcb.numerocuenta ilike '%" . $params->numerocuenta . "%' and ";
        }
        if ($params->grado != "") {
            $filtro .= "lower(ng.denominacion) ilike '%" . strtolower($params->grado) . "%' and ";
        }
        if (count($params->arrayidplantillas) > 0) {
            $idsPlantillaTxt = implode(',', $params->arrayidplantillas);

            $filtro .= "cpn.idplantillanominal in ($idsPlantillaTxt) and ";
            
        }
        $filtro .= " dp.feliminado is null";
        return $filtro;
    }

    public function countBuscadorPersonasTalonPago($texto, $identidad, $idelaborarpagos)
    {
        $idelaborarpagos = is_array($idelaborarpagos) ? implode(',', $idelaborarpagos) : $idelaborarpagos;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $where = '';
        if ($texto != '') {
            $arreglo = split(' ', $texto);
            $or = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%'";
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        $where .= ($where != '') ? ' and (dp.feliminado is null and dco.idcargosocupados is not null and dpep.idelaborarpagos IN (' . $idelaborarpagos . ') and dpep.excluido = 0)' : ' dp.feliminado is null and dco.idcargosocupados is not null and dpep.idelaborarpagos IN (' . $idelaborarpagos . ') and dpep.excluido = 0';
        $sql = "";
        $sql .= "SELECT count(distinct(dp.idpersona)) as cantidad
			FROM mod_persona.dat_persona dp
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona AND dco.identidad = " . $identidad . ")
			LEFT  JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT  JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal)
			LEFT  JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
			INNER JOIN mod_nomina.dat_personaselaborarpagos dpep ON (dpep.idpersona = dp.idpersona)
			WHERE " . $where . ";";
        $resultado = $conn->fetchAll($sql);
        return $resultado[0]['cantidad'];
    }

}