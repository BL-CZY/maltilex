#[derive(Debug)]
pub enum QueryLogType {
    Search,
}

#[derive(Debug)]
pub struct QueryLog<'a> {
    pub q_type: QueryLogType,
    pub id: &'a u128,
    pub msg: &'a str,
}

pub fn log(info: QueryLog) {
    println!(
        "Query ID: {:x?} Type: {:?} Msg: {:?}",
        info.id, info.q_type, info.msg
    )
}
