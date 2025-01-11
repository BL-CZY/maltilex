RSC=cargo
RSC_CMD=build
RS_FLAGS=--release
BIN_PATH=target/release
BIN_NAME=helper-oxide

.PHONY: build
build: src/main.rs
	$(RSC) $(RSC_CMD) $(RS_FLAGS)
	rm helper-oxide
	cp $(BIN_PATH)/$(BIN_NAME) .
