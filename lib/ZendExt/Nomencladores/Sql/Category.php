<?php
class ZendExt_Nomencladores_Sql_Category
{

    function getCategories($pOfset, $pLimit)
    {
        $query = "select * from nom_categoria";
        if ($pLimit) {
            $query .= " offset($pOfset) limit($pLimit)";
        }
        return $query;
    }

    function addCategory($pId, $pCategory)
    {
        return "insert into nom_categoria (idcategoria, denominacion) values ($pId, '$pCategory')";
    }

    function updateCategory($pIdCategory, $pCategory)
    {
        return "update nom_categoria set denominacion = '$pCategory' where idcategoria = $pIdCategory";
    }

    function deleteCategory($pIdCategory)
    {
        return "delete from nom_categoria where idcategoria = $pIdCategory";
    }

    function setCategoryToTable($pSchema, $pIdTable, $pIdCategory)
    {
        return "insert into dat_tablascategoria values ('$pIdTable', $pIdCategory, 0, '$pSchema')";
    }

    function dropCategoryToTable($pSchema, $pIdTable, $pIdCategory)
    {
        return "delete from dat_tablascategoria "
        . "where esquema = '$pSchema' and tabla = '$pIdTable' "
                . "and idcategoria = $pIdCategory";
    }

    function getCategoriesFromTable($pTablename)
    {
        return "select nom_categoria.denominacion from dat_tablascategoria inner
			join nom_categoria on nom_categoria.idcategoria =
			dat_tablascategoria.idcategoria
			where dat_tablascategoria.tabla =  '$pTablename'";

    }

    function getTablesFromCategory($pIdCategory)
    {
        return "select tabla, esquema from
                dat_tablascategoria inner
                join nom_categoria on dat_tablascategoria.idcategoria
                = nom_categoria.idcategoria
                where nom_categoria.idcategoria = $pIdCategory";
    }

    public function countCategories()
    {
        return "SELECT COUNT (*) FROM nom_categoria";
    }

    function haveThisCategory($pIdTable, $pIdCategory)
    {
        return "select idcategoria from dat_tablascategoria "
        . "where tabla = '$pIdTable' and  idcategoria = $pIdCategory";
    }

}
